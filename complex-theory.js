import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";


var id = "OuO";
var name = "Complex Theory";
var description = "As you can see, Complex.";
var authors = "Skyhigh173#3120";
var version = 1;


var currency;
var n, a1;
var a2;
var a1Exp;
var a2Term;

var achievement1, achievement2;
var chapter1, chapter2;

var init = () => {
    currency = theory.createCurrency();

    
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
        a1 = theory.createUpgrade(1, currency, new ExponentialCost(1, Math.log2(6)));
        a1.getDescription = (_) => Utils.getMath(getDesc(a1.level));
        a1.getInfo = (amount) => Utils.getMathTo(getInfo(a1.level), getInfo(a1.level + amount));
    }
    // a2
    {
        let getDesc = (level) => "a_2=" + getA2(level).toString(0);
        a2 = theory.createUpgrade(2, currency, new ExponentialCost(2, Math.log2(15)));
        a2.getDescription = (_) => Utils.getMath(getDesc(a2.level));
        a2.getInfo = (amount) => Utils.getMathTo(getDesc(a2.level), getDesc(a2.level + amount));
        a2.isAvailable = false;
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e5);
    theory.createBuyAllUpgrade(1, currency, 1e15);
    theory.createAutoBuyerUpgrade(2, currency, 1e20);

    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(5, 10));

    {
        a1Exp = theory.createMilestoneUpgrade(0, 3);
        a1Exp.description = Localization.getUpgradeIncCustomExpDesc("a_1", "0.05");
        a1Exp.info = Localization.getUpgradeIncCustomExpInfo("a_1", "0.05");
        a1Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }
    
    {
        a2Term = theory.createMilestoneUpgrade(1, 1);
        a2Term.description = Localization.getUpgradeAddTermDesc("(a_{2}^{2})(log(1 + a_2))");
        a2Term.info = Localization.getUpgradeAddTermInfo("(a_{2}^{2})(log(1 + a_2))");
        a2Term.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); };
    }
    
    /////////////////
    //// Achievements
    achievement1 = theory.createAchievement(0, "a new start", "Buy!", () => n.level > 1);
    achievement2 = theory.createSecretAchievement(1, "Max power", "Wait wat? u buy 10000", "spam", () => n.level > 10000);

    ///////////////////
    //// Story chapters
    chapter1 = theory.createStoryChapter(0, "The OuO Theory", "One day, \nyou saw a news. \n \nThis Theory is strange.\nCan you solve this?\nOr...?", () => n.level > 0);
    chapter2 = theory.createStoryChapter(1, "My Second Chapter", "This is line 1 again,\nand this is line 2... again.\n\nNice again.", () => a1.level > 100);

    updateAvailability();
}

var updateAvailability = () => {
    
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    let term1 = a2Term.level > 0 ? ( getA2(a2.level) ^ 2 * Math.log(1 + getA2(a2.level)) );
    currency.value += dt * bonus * getA1(a1.level).pow(getA1Exponent(a1Exp.level)) +
                                   getN(n.level)^0.01 + term1;
}

var getPrimaryEquation = () => {
    let result = "\\dot{\\rho} = n^{0.01} + a_1";

    if (a1Exp.level == 1) result += "^{1.05}";
    if (a1Exp.level == 2) result += "^{1.1}";
    if (a1Exp.level == 3) result += "^{1.15}";
    
    if (a2Term.level > 0)
        result += "(a_{2}^{2})(log(1 + a_2))";
    
    

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
