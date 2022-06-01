import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";
import {ui} from "./api/ui/UI";

// Trigonometry

var id = "Triangle?";
var name = "Trigonometry";
var description = "You need some (a little) skills to play this theory.\nTrigonometry theory, play with sin() cos() and more. Pay attention to vartheta, it will slow down your theory when it gets bigger!";
var authors = "Skyhigh173#3120";
var version = "Beta v1.1.3  0x0000";


var currency1;
var a1, a2, a3, a4;
var a1Exp, a2Exp, GameSpeed, moreK, moreTerm;
var q, k, vdt;
var Aq = BigNumber.ONE;
var x = BigNumber.ZERO;
var dotrho, div;
var postQ;

var init = () => {
    currency1 = theory.createCurrency();
    
    // Regular upgrades
    
    // a1
    {
        let getDesc = (level) => "a_1=2^{" + level + "}";
        let getInfo = (level) => "a_1=" + getA1(level).toString(0);
        a1 = theory.createUpgrade(0, currency1, new FirstFreeCost(new ExponentialCost(5, Math.log2(3.5))));
        a1.getDescription = (_) => Utils.getMath(getDesc(a1.level));
        a1.getInfo = (amount) => Utils.getMathTo(getInfo(a1.level), getInfo(a1.level + amount));
    }
    // a2
    {
        let getDesc = (level) => "a_2=2^{" + level + "}";
        let getInfo = (level) => "a_2=" + getA2(level).toString(0);
        a2 = theory.createUpgrade(1, currency1, new ExponentialCost(100, Math.log2(3.8)));
        a2.getDescription = (_) => Utils.getMath(getDesc(a2.level));
        a2.getInfo = (amount) => Utils.getMathTo(getInfo(a2.level), getInfo(a2.level + amount));
    }
    // a3
    {
        let getDesc = (level) => "a_3=5^{" + level + "}";
        let getInfo = (level) => "a_3=" + getA3(level).toString(0);
        a3 = theory.createUpgrade(2, currency1, new ExponentialCost(1e75, Math.log2(3.4)));
        a3.getDescription = (_) => Utils.getMath(getDesc(a3.level));
        a3.getInfo = (amount) => Utils.getMathTo(getInfo(a3.level), getInfo(a3.level + amount));
    }
    // q
    {
        let getDesc = (level) => "\\dot{q}=" + getQ(level) / BigNumber.from(20);
        q = theory.createUpgrade(10, currency1, new ExponentialCost(10, Math.log2(4.8)));
        q.getDescription = (_) => Utils.getMath(getDesc(q.level));
        q.getInfo = (amount) => Utils.getMathTo(getDesc(q.level), getDesc(q.level + amount));
    }
    // k
    {
        let getDesc = (level) => "k=" + getK(level).toString(2);
        let getInfo = (level) => "k=" + getK(level).toString(2);
        k = theory.createUpgrade(11, currency1, new ExponentialCost(100, Math.log2(90)));
        k.getDescription = (_) => Utils.getMath(getDesc(k.level));
        k.getInfo = (amount) => Utils.getMathTo(getInfo(k.level), getInfo(k.level + amount));
        //k.maxLevel = 20;
        // k = -0 -> k = 1 (step = 0.05)
    }
     // vdt
    {
        let getDesc = (level) => "\\vartheta =" + getDT(level).toString(0);
        vdt = theory.createUpgrade(12, currency1, new ExponentialCost(25, Math.log2(3.5)));
        vdt.getDescription = (_) => Utils.getMath(getDesc(vdt.level));
        vdt.getInfo = (amount) => Utils.getMathTo(getDesc(vdt.level), getDesc(vdt.level + amount));
    }
    
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency1, 1e10);
    theory.createBuyAllUpgrade(1, currency1, 1e15);
    theory.createAutoBuyerUpgrade(2, currency1, 1e30);
    
    // milestone upgrades
    theory.setMilestoneCost(new CompositeCost(4, new LinearCost(4, 2), new LinearCost(15, 5)));
    
    {
        a1Exp = theory.createMilestoneUpgrade(0, 2);
        a1Exp.description = Localization.getUpgradeIncCustomExpDesc("a_1", "0.1");
        a1Exp.info = Localization.getUpgradeIncCustomExpInfo("a_1", "0.1");
        a1Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }
    
    {
        a2Exp= theory.createMilestoneUpgrade(10, 2);
        a2Exp.description = Localization.getUpgradeIncCustomExpDesc("a_2", "0.1");
        a2Exp.info = Localization.getUpgradeIncCustomExpInfo("a_2", "0.1");
        a2Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }
    {
        GameSpeed = theory.createMilestoneUpgrade(1, 3);
        GameSpeed.description = Localization.getUpgradeIncCustomDesc("Speed", "100 \\%");
        GameSpeed.info = Localization.getUpgradeIncCustomInfo("Speed", "100 \\%");
        GameSpeed.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }
    
    {
        moreK = theory.createMilestoneUpgrade(2, 2);
        moreK.description = "$\\uparrow$ K max level by 20";
        moreK.info = "Increases maximum level of K by 20";
        moreK.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
        moreK.canBeRefunded = (_) => (k.level <= 20 && moreK.level == 1) || (k.level <= 40 && moreK.level == 2) ;
    }
    
    {
        moreTerm = theory.createMilestoneUpgrade(3, 1);
        moreTerm.description = Localization.getUpgradeAddTermDesc("a_3");
        moreTerm.info = Localization.getUpgradeAddTermInfo("a_3");
        moreTerm.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }
    
    
    CreateAch();
    
    updateAvailability();
}
var updateAvailability = () => {
    let bf = (num) => BigNumber.from(num);
    let tbf = (num) => bf(num).pow(bf(0.2))
    
    GameSpeed.isAvailable = theory.tau >= tbf(1e50);
    moreK.isAvailable = theory.tau >= tbf(1e18);
    moreTerm.isAvailable = theory.tau >= tbf(1e100);
    a2Exp.isAvailable = theory.tau >= tbf(1e100);
    
    a3.isAvailable = moreTerm.level >= 1;
    
    
    k.maxLevel = 20 + moreK.level * 20;
}
var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    
    // bignumber setup
    let bf = (num) => BigNumber.from(num);
    let b2 = BigNumber.TWO;
    
    // x calc
    x += bf(0.125) * dt;
    
    
    // x diverge calc
    // if x is greater then vdt*pi/4, it grows by x^2 not sin(x).
    div = bf(1);
    if (x > getDT(vdt.level) * b2 / bf(4)) div = (x - getDT(vdt.level) * b2 / bf(4)).pow(b2) + x.sin();
    else div = x.sin();
    let div2 = div.abs() + BigNumber.TEN.pow(bf(0) - getK(k.level)); //10^(-k)
    
    // Exp Calc
    let ExpA1 = bf(1 + a1Exp.level / 10);
    let ExpA2 = bf(1 + a2Exp.level / 10);
    
    // Q calc
    let Q = getQ(q.level);
    
    Aq += Q * dt / bf(20);
    Aq = Aq.min(Q * 4000 + 1);
    
    // final calc
    let upTerm = getA1(a1.level).pow(ExpA1) * Aq;
    upTerm += getA2(a2.level).pow(ExpA2) * bf(Aq).pow(bf(2));
    if (moreTerm.level >= 1) upTerm += getA3(a3.level) * Aq.pow(bf(5));
    
    // div total prodution bc of balance problem
    let stage = 2; 
    
    // rho
    dotrho = upTerm / div2 / bf(stage) * bf(2).pow(bf(GameSpeed.level));
    // stop if no actions
    if (a1.level == 0) {
        dotrho = bf(0);
        x = bf(0);
    }
    currency1.value += dotrho * bonus * dt;
    
    theory.invalidateTertiaryEquation();
    updateAvailability();
}
var getInternalState = () => `${x} ${Aq}`;
var setInternalState = (state) => {
    let values = state.split(" ");
    if (values.length > 0) x = parseBigNumber(values[0]);
    if (values.length > 1) Aq = parseBigNumber(values[1]);
}

var getPrimaryEquation = () => {
    theory.primaryEquationHeight = 90;
    let result = "\\dot{\\rho} = \\frac{a_1";
    if (a1Exp.level >= 1) result += "^{" + (1 + a1Exp.level / 10) + "}";
    result += " q + a_2"
    if (a2.level >= 1) result += "^{" + (1 + a2Exp.level / 10) + "}";
    result += "} q^{2}";
    if (moreTerm.level >= 1) result += " + a_3 q^{5} ";
    result += "}{\\mid \\varrho \\mid + 10^{-k}}";
    return result;
}

var getSecondaryEquation = () => {
    theory.secondaryEquationHeight = 80;
    let result = "\\varrho = \\sum_{n=0}^{\\vartheta} \\frac{(-1)^{n} x^{2n+1}}{(2n+1)!}";
    result += "\\qquad" + theory.latexSymbol + "=\\max\\rho^{0.2}";
    return result;
}
var getTertiaryEquation = () => {
    let r = " x =" + x;
    r += "\\qquad \\dot{\\rho} =" + (dotrho * theory.publicationMultiplier);
    r += "\\qquad \\varrho =" + div;
    r += "\\qquad q =" + Aq;
    return r;
}
var prePublish = () => {
    postQ = getQ(q.level) / BigNumber.from(20);
}
var postPublish = () => {
    x = BigNumber.ZERO;
    Aq = Aq / BigNumber.THREE;
    Aq = Aq.min(postQ * 1500);
    Aq += BigNumber.ONE;
}

var getEquationOverlay = (_) => {
    let result = ui.createLatexLabel({text: version, displacementY: 4, displacementX: 4, fontSize: 9, textColor: Color.TEXT_MEDIUM});
    return result;
}


function CreateAch () {
    let ac1 = theory.createAchievementCategory(0, "Tau/Rho");
    let ac2 = theory.createAchievementCategory(1, "Derivative");
    let ac3 = theory.createAchievementCategory(2, "Sigma");
    let ac4 = theory.createAchievementCategory(3, "Miscellaneous");
    let acs = theory.createAchievementCategory(10, "Secret");
    let bf = (num) => BigNumber.from(num);
    let tau = theory.tau.pow(bf(5));
    let t = getDT(vdt.level);
    
    theory.createAchievement(0, ac1, "Where it begins", "Begin the theory", () => tau >= 1);
    theory.createAchievement(1, ac1, "Need faster", "reach 1e10 rho", () => tau >= 1e10);
    theory.createAchievement(2, ac1, "Milestone get!", "reach 1e20 rho", () => tau >= 1e20);
    theory.createAchievement(3, ac1, "Full Speed : ON", "reach 1e30 rho", () => tau >= 1e30);
    theory.createAchievement(4, ac1, "Skillful Pro Player", "reach 1e50 rho", () => tau >= 1e50);
    theory.createAchievement(5, ac1, "Such a waste of time", "reach 1e75 rho", () => tau >= 1e75);
    theory.createAchievement(6, ac1, "Lets goo!", "reach 1e100 rho", () => tau >= 1e100);
    theory.createAchievement(7, ac1, "GAS GAS GAS", "reach 1e200 rho", () => tau >= 1e200);
    theory.createAchievement(8, ac1, "Master", "reach 1e300 rho", () => tau >= bf("1e300"));
    //theory.createAchievement(9, ac1, "True. Master", "reach 1e500 rho", () => tau >= bf("1e500"));
    //theory.createAchievement(10, ac1, "Near the end...?", "reach 1e750 rho", () => tau >= bf("1e750"));
    //theory.createAchievement(11, ac1, "The end.", "reach 1e1000 rho", () => tau >= bf("1e1000"));
    
    theory.createAchievement(100, ac2, "linear growth", "have q's value greater then 1000 ", () => Aq >= 1000);
    theory.createAchievement(101, ac2, "x^2", "have q's value greater then 1e5 ", () => Aq >= 1e5);
    theory.createAchievement(102, ac2, "Exponential growth", "have q's value greater then 1e10 ", () => Aq >= 1e10);
    theory.createAchievement(103, ac2, "Tetration?", "have q's value greater then 1e15 ", () => Aq >= 1e15);
    theory.createAchievement(104, ac2, "King of derivative", "have q's value greater then 1e30 ", () => Aq >= 1e30);
    
    theory.createAchievement(150, ac3, "A lots of loop", "Reach 1000 in vartheta", () => t >= 1000);
    theory.createAchievement(151, ac3, "Dont you think its possible", "Reach 5000 in vartheta", () => t >= 5000);
    theory.createAchievement(152, ac3, "Fractal", "Reach 10000 in vartheta", () => t >= 10000);
    
    // More Secret Achievement soon tm
    //theory.createSecretAchievement(500, acs, "ouo", "reach 6.9e420 ouo", "do you even need tips for this?", () => theory.tau >= bf("6.9e420"));
    //theory.createSecretAchievement(501, acs, "Why not?", "Reach... 20000 in vartheta??!", "Hey, progress pls?", () => t >= 20000);
}
var TauExp = 0.2;
var getPublicationMultiplier = (tau) => tau.pow(0.24 * (1 / TauExp)) / BigNumber.THREE;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{" + (Math.floor(100 * 0.24 * (1 / TauExp)) / 100) + "}}{3}";
var getTau = () => currency1.value.pow(BigNumber.from(TauExp));
var get2DGraphValue = () => currency1.value.sign * (BigNumber.ONE + currency1.value.abs()).log10().toNumber();
var getCurrencyFromTau = (tau) => [tau.max(BigNumber.ONE).pow(5), currency1.symbol];

var getA1 = (level) => BigNumber.TWO.pow(level);
var getA2 = (level) => BigNumber.TWO.pow(level);
var getA3 = (level) => BigNumber.FIVE.pow(level);
var getQ = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getK = (level) => BigNumber.from(level * 0.05);
var getDT = (level) => BigNumber.from(12 * level + 8);
init();
