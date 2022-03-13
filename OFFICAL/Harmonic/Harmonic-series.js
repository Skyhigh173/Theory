import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "Harmonic-series_SUM";
var name = "Harmonic-series";
var description = "A basic theory.";
var authors = "Skyhigh173#3120";
var version = "v0.0.1";

var currency;
var a1 = BigNumber.ONE, a2 = BigNumber.ONE;
var a3 = BigNumber.ONE, a4 = BigNumber.ONE;
var n1 = BigNumber.ONE;

var b1 = BigNumber.ZERO, b2 = BigNumber.ZERO;
var db1 = BigNumber.ZERO, db2 = BigNumber.ZERO;



var chapter1, chapter2;

var init = () => {
    currency = theory.createCurrency();
    
    theory.primaryEquationHeight = 75;

    ///////////////////
    // Regular Upgrades

    // a1
    {
        let getDesc = (level) => "a_1=2^{" + level + "}";
        let getInfo = (level) => "a_1=" + getA1(level).toString(0);
        a1 = theory.createUpgrade(0, currency, new ExponentialCost(1, Math.log2(10)));
        a1.getDescription = (_) => Utils.getMath(getDesc(a1.level));
        a1.getInfo = (amount) => Utils.getMathTo(getInfo(a1.level), getInfo(a1.level + amount));
    }
    // a2
    {
        let getDesc = (level) => "a_2=" + getA2(level).toString(0);
        a2 = theory.createUpgrade(1, currency, new ExponentialCost(30, Math.log2(4)));
        a2.getDescription = (_) => Utils.getMath(getDesc(a2.level));
        a2.getInfo = (amount) => Utils.getMathTo(getDesc(a2.level), getDesc(a2.level + amount));
    }
    // n1
    {
        let getDesc = (level) => "n_1=" + getN1(level).toString(0);
        n1 = theory.createUpgrade(2, currency, new ExponentialCost(100000, Math.log2(12)));
        n1.getDescription = (_) => Utils.getMath(getDesc(n1.level));
        n1.getInfo = (amount) => Utils.getMathTo(getDesc(n1.level), getDesc(n1.level + amount));
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e10);
    theory.createBuyAllUpgrade(1, currency, 1e13);
    theory.createAutoBuyerUpgrade(2, currency, 1e30);

    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(25, 25));

    
    
    /////////////////
    //// Achievements
    

    ///////////////////
    //// Story chapters
    chapter1 = theory.createStoryChapter(0, "Harmonic series", "This is line 1,\nand this is line 2.\n\nNice.", () => a1.level > 0);
    chapter2 = theory.createStoryChapter(1, "My Second Chapter", "This is line 1 again,\nand this is line 2... again.\n\nNice again.", () => a2.level > 0);

    updateAvailability();
}

var updateAvailability = () => {
    
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    currency.value += dt * bonus * ( (getA1(a1.level) * getA2(a2.level)).pow(0.5) * getN1(n1.level));
}

var getPrimaryEquation = () => {
    let result = "\\lim_{k \\rightarrow  \\infty } \\sum_{n=1}^{k}  \\frac{1}{n}";
    result += " \\\\\\ ";
    result += "\\dot{\\rho} =  \\sqrt{a_1 a_2 a_3 a_4} \\cdot n_1 + b_1";

    

    return result;
}

var getSecondaryEquation = () => theory.latexSymbol + "=\\max\\rho";
var getPublicationMultiplier = (tau) => tau.pow(0.164) / BigNumber.THREE;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.164}}{3}";
var getTau = () => currency.value;
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getA1 = (level) => BigNumber.TWO.pow(level);
var getA2 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 1);
var getN1 = (level) => Utils.getStepwisePowerSum(level, 2, 6, 1);

init();
