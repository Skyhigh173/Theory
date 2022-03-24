import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "theory10-null";
var name = "T10";
var description = "A j100ba,s'ic ?!the!o!.ry.. \n101011010001001111010001010111001001010001010101010010";
var authors = "ERROR LOL \n \n \n print(gg)";
var version = "4.1";

var currency;
var c1, c2;
var c1Exp, c2Exp;
var a, b, c, d;

var achievement1, achievement2;
var chapter1, chapter2;

var init = () => {
    currency = theory.createCurrency();

    ///////////////////
    // Regular Upgrades

    // c1
    {
        let getDesc = (level) => "c_0 \\neq" + getC1(level).toString(0);
        c1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(1, Math.log2(1.001))));
        c1.getDescription = (_) => Utils.getMath(getDesc(c1.level));
        c1.getInfo = (amount) => Utils.getMathTo(getDesc(c1.level), getDesc(c1.level + amount));
    }

    // c2
    {
        let getDesc = (level) => "c_2==c_{1}^{" + level + "}";
        let getInfo = (level) => "c_2=" + getC2(level).toString(0);
        c2 = theory.createUpgrade(1, currency, new ExponentialCost(1, Math.log2(1234)));
        c2.getDescription = (_) => Utils.getMath(getDesc(c2.level));
        c2.getInfo = (amount) => Utils.getMathTo(getInfo(c2.level), getInfo(c2.level + amount));
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1);
    theory.createBuyAllUpgrade(1, currency, 69420);
    theory.createAutoBuyerUpgrade(2, currency, 123456789);

    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(1, 1234));

    {
        c1Exp = theory.createMilestoneUpgrade(0, 3);
        c1Exp.description = Localization.getUpgradeIncCustomExpDesc("c_1", "0.05");
        c1Exp.info = Localization.getUpgradeIncCustomExpInfo("c_1", "0.05");
        c1Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }

    {
        c2Exp = theory.createMilestoneUpgrade(1, 3);
        c2Exp.description = Localization.getUpgradeIncCustomExpDesc("c_2", "0.05");
        c2Exp.info = Localization.getUpgradeIncCustomExpInfo("c_2", "0.05");
        c2Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }
    
    /////////////////
    //// Achievements
    achievement1 = theory.createAchievement(0, "a cool ach", "OuO", () => c1.level > 1);
    achievement2 = theory.createSecretAchievement(1, "OuO", "going brr", "", () => c2.level > 1);

    ///////////////////
    //// Story chapters
    //chapter1 = theory.createStoryChapter(0, "My First Chapter", "This is line 1,\nand this is line 2.\n\nNice.", () => c1.level > 0);
    //chapter2 = theory.createStoryChapter(1, "My Second Chapter", "This is line 1 again,\nand this is line 2... again.\n\nNice again.", () => c2.level > 0);
    //NOOOOOOOOOOOOOOOOOOPE
    updateAvailability();
}

var updateAvailability = () => {
    c2Exp.isAvailable = c1Exp.level > 1;
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    currency.value += 1;
}

var getPrimaryEquation = () => {
    theory.primaryEquationHeight = 80;
    let result = "\\dot{\\rho} = \\int_{\\oint  \\cdots \\oint_{ \\partial V}^{}}^{n-1} F \\times d^{ \\upsilon } \\times ( e^{\\pi i} +1)";

    return result;
}

var getSecondaryEquation = () => theory.latexSymbol + "=\\min\\rho";
var getPublicationMultiplier = (tau) => tau.pow(0.3) / BigNumber.THREE;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{ \\pi}}{3}";
var getTau = () => currency.value.pow(BigNumber.HUNDRED);
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + Math.random() * currency.value.abs()).log10().toNumber();

var getC1 = (level) => Utils.getStepwisePowerSum(level, 7, 2, 0);
var getC2 = (level) => BigNumber.TEN.pow(level);
var getC1Exponent = (level) => BigNumber.from(1 + 0.05 * level);
var getC2Exponent = (level) => BigNumber.from(1 + 0.05 * level);

init();
