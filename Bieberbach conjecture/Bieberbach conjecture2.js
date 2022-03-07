import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";


var id = "OuO";
var name = "Bieberbach conjecture";
var description = "Curreny nothin here";
var authors = "Skyhigh173#3120";
var version = 2;


var currency;
var n, a1;
var a1Exp;

var achievement1, achievement2;
var chapter1, chapter2;

var init = () => {
    currency = theory.createCurrency();
    theory.primaryEquationHeight = 75;

    
    ///////////////////
    // Regular Upgrades

    // n
    {
        let getDesc = (level) => "n=" + getN(level).toString(0);
        n = theory.createUpgrade(0, currency, new FreeCost());
        n.getDescription = (_) => Utils.getMath(getDesc(n.level));
        n.getInfo = (amount) => Utils.getMathTo(getDesc(n.level), getDesc(n.level + amount));
    }

    // a1
    {
        let getDesc = (level) => "a_1=2^{" + level + "}";
        let getInfo = (level) => "a_1=" + getA1(level).toString(0);
        a1 = theory.createUpgrade(1, currency, new ExponentialCost(1, Math.log2(2)));
        a1.getDescription = (_) => Utils.getMath(getDesc(a1.level));
        a1.getInfo = (amount) => Utils.getMathTo(getInfo(a1.level), getInfo(a1.level + amount));
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e5);
    theory.createBuyAllUpgrade(1, currency, 1e13);
    theory.createAutoBuyerUpgrade(2, currency, 1e30);

    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(10, 5));

    {
        a1Exp = theory.createMilestoneUpgrade(0, 3);
        a1Exp.description = Localization.getUpgradeIncCustomExpDesc("a_1", "0.05");
        a1Exp.info = Localization.getUpgradeIncCustomExpInfo("a_1", "0.05");
        a1Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }
    
    /////////////////
    //// Achievements
    achievement1 = theory.createAchievement(0, "Begin x1", "Buy your first upgrade", () => n.level > 1);
    achievement2 = theory.createSecretAchievement(1, "Max power", "Buy 10000x n", "spam", () => n.level > 10000);

    ///////////////////
    //// Story chapters
    chapter1 = theory.createStoryChapter(0, "The Beginning", "After you came back from a holidays,\nyou learnt a new things.\n\nBieberbach conjecture...?", () => n.level > 0);
    chapter2 = theory.createStoryChapter(1, "The progress", "You got some progress.\nYou havea new variable in the menu,\nBut you dont know what is it.", () => currency.value > 5e6);

    updateAvailability();
}

var updateAvailability = () => {
    
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    currency.value += dt * bonus * getA1(a1.level).pow(getA1Exponent(a1Exp.level)) +
                                   getN(n.level);
}

var getPrimaryEquation = () => {
    let result = "\\begin{matrix} f(z)=z + \\sum_{n \\geq 2}^{} a_n z^n \\\\\\ \\beta = k ^ {0.5} + f(j)  \\times b_1 \\\\\\ \\dot{ \\rho} = \\beta \\end{matrix} ";

    return result;
}

var getSecondaryEquation = () => theory.latexSymbol + "=\\max\\rho";
var getPublicationMultiplier = (tau) => tau.pow(0.164) / BigNumber.THREE;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.164}}{3}";
var getTau = () => currency.value;
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getN = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getA1 = (level) => BigNumber.TWO.pow(level);
var getA1Exponent = (level) => BigNumber.from(1 + 0.05 * level);

init();
