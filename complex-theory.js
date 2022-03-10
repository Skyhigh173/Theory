import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";


var id = "a+bi";
var name = "Complex Theory";
var description = "As you can see, Complex.";
var authors = "Skyhigh173#3120";
var version = 1;


var currency;
var n, k, a1, a2;
var a2;

var a1Exp;
var a2Term;
var alphaTerm, betaTerm;

var achievement1, achievement2;
var chapter1, chapter2;

var init = () => {
    currency = theory.createCurrency();
    theory.primaryEquationHeight = 70;

    
    ///////////////////
    // Regular Upgrades

    // n
    {
        let getDesc = (level) => "n=" + getN(level).toString(1);
        n = theory.createUpgrade(0, currency, new FreeCost());
        n.getDescription = (_) => Utils.getMath(getDesc(n.level));
        n.getInfo = (amount) => Utils.getMathTo(getDesc(n.level), getDesc(n.level + amount));
    }
   
    // k
    {
        let getDesc = (level) => "k=2^{" + level + "}";
        let getInfo = (level) => "k=" + getK(level).toString(0);
        k = theory.createUpgrade(1, currency, new ExponentialCost(1, Math.log2(18)));
        k.getDescription = (_) => Utils.getMath(getDesc(k.level));
        k.getInfo = (amount) => Utils.getMathTo(getInfo(k.level), getInfo(k.level + amount));
    }

    // a1
    {
        let getDesc = (level) => "a_1=" + getN(level).toString(0);
        a1 = theory.createUpgrade(2, currency, new ExponentialCost(2, Math.log2(6)));
        a1.getDescription = (_) => Utils.getMath(getDesc(a1.level));
        a1.getInfo = (amount) => Utils.getMathTo(getDesc(a1.level), getDesc(a1.level + amount));
    }
    
    // a2
    {
        let getDesc = (level) => "a_2=" + getA2(level).toString(0);
        a2 = theory.createUpgrade(3, currency, new ExponentialCost(3, Math.log2(10)));
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
    theory.setMilestoneCost(new LinearCost(1, 1));

    //variable term
    {
        alphaTerm = theory.createMilestoneUpgrade(1000, 1);
        alphaTerm.description = Localization.getUpgradeAddTermDesc("\\alpha");
        alphaTerm.info = Localization.getUpgradeAddTermInfo("\\alpha");
        alphaTerm.canBeRefunded = (_) => betaTerm.level == 0;
        alphaTerm.boughtOrRefunded = (_) => { theory.invalidateSecondaryEquation(); updateAvailability(); theory.invalidatePrimaryEquation(); };
    }
    {
        betaTerm = theory.createMilestoneUpgrade(1001, 1);
        betaTerm.description = Localization.getUpgradeAddTermDesc("\\beta");
        betaTerm.info = Localization.getUpgradeAddTermInfo("\\beta");
        betaTerm.boughtOrRefunded = (_) => { theory.invalidateSecondaryEquation(); updateAvailability(); theory.invalidatePrimaryEquation(); };
        betaTerm.isAvailable = false;
    }
    //dimension
  
    
    
    //normal term
    {
        a1Exp = theory.createMilestoneUpgrade(0, 3);
        a1Exp.description = Localization.getUpgradeIncCustomExpDesc("a_1", "0.05");
        a1Exp.info = Localization.getUpgradeIncCustomExpInfo("a_1", "0.05");
        a1Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }
    
    {
        a2Term = theory.createMilestoneUpgrade(1, 1);
        a2Term.description = Localization.getUpgradeAddTermDesc("a_2");
        a2Term.info = Localization.getUpgradeAddTermInfo("a_2");
        a2Term.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); };
    }
    
    /////////////////
    //// Achievements
    achievement1 = theory.createAchievement(0, "a new start", "Buy!", () => n.level > 1);
    achievement2 = theory.createSecretAchievement(1, "Max power", "Wait wat? u buy 10000", "spam", () => n.level > 10000);

    ///////////////////
    //// Story chapters
    chapter1 = theory.createStoryChapter(0, "The beginning", "You started to research complex number. \n \n a+bi \n \n ...", () => n.level > 0);
    chapter2 = theory.createStoryChapter(1, "My Second Chapter", "This is line 1 again,\nand this is line 2... again.\n\nNice again.", () => a1.level > 100);

    updateAvailability();
}

var updateAvailability = () => {
    a2.isAvailable = a2Term.level > 0;
    betaTerm.isAvailable = alphaTerm.level > 0;
    
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    
    let term1 = ( a2Term.level > 0 ? getA2(a2.level) ^ 2 * Math.log(1 + getA2(a2.level)) : BigNumber.ZERO);
    let termAlpha = ( alphaTerm.level > 0 ? getA1(a1.level) + getK(k.level) : BigNumber.ZERO );
    let termBeta = ( betaTerm.level > 0 ? termAlpha * getA1(a1.level) : BigNumber.ZERO );
    currency.value += dt * bonus * (getA1(a1.level).pow(getA1Exponent(a1Exp.level)) +
                                   getN(n.level)^0.01 + term1 + termAlpha + termBeta);
}

var getPrimaryEquation = () => {
    let result = "Z = Z^{k} + c \\\\\\ \\dot{\\rho} = n^{0.01} + \\sqrt{k a_1";

    if (a1Exp.level == 1) result += "^{1.05}";
    if (a1Exp.level == 2) result += "^{1.1}";
    if (a1Exp.level == 3) result += "^{1.15}";
    
    a2Term.level > 0 ? ( result += " a_2}" ) : ( result += "}" );
    if (alphaTerm.level > 0) result += " + \\alpha ";
    if (betaTerm.level > 0) result += " + \\beta ";
    
    return result;
}

var getSecondaryEquation = () => {
    let result = " "
    if (alphaTerm.level > 0) result += "\\alpha = a_1 + k " ;
    result += "\\qquad"
    if (betaTerm.level > 0) result += " \\beta = \\alpha * a_1";
    return result;
}
    


var getTertiaryEquation = () => theory.latexSymbol + "=\\max\\rho";

var getPublicationMultiplier = (tau) => tau.pow(0.164) / BigNumber.THREE;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.164}}{3}";
var getTau = () => currency.value;
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getN = (level) => BigNumber.from(level * 0.5);
var getK = (level) => BigNumber.TWO.pow(level);
var getA1 = (level) => BigNumber.from(level);
var getA1Exponent = (level) => BigNumber.from(1 + 0.05 * level);
var getA2 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
init();
