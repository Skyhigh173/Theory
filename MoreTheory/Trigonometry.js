import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";
import {ui} from "./api/ui/UI";

// Trigonometry
// at start i dont think it will be well balanced :O
var id = "Triangle?";
var name = "Trigonometry";
var description = "You need some (a little) skills to play this theory.\nif your rho gain is super slow, buy last upgrade.\nYou will also keep 1/3 of Q when you pub.";
var authors = "Skyhigh173#3120";
var version = "Beta v1.0.3  0x0002";


var currency1;
var a1, a2, a3, a4;
var a1Exp, GameSpeed, moreK, moreTerm;
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
        a1 = theory.createUpgrade(0, currency1, new FirstFreeCost(new ExponentialCost(5, Math.log2(3.6))));
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
        let getDesc = (level) => "a_3=2^{" + level + "}";
        let getInfo = (level) => "a_3=" + getA3(level).toString(0);
        a3 = theory.createUpgrade(2, currency1, new ExponentialCost(1e100, Math.log2(4.2)));
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
    theory.setMilestoneCost(new LinearCost(20, 10));
    
    {
        a1Exp = theory.createMilestoneUpgrade(0, 2);
        a1Exp.description = Localization.getUpgradeIncCustomExpDesc("a_1", "0.1");
        a1Exp.info = Localization.getUpgradeIncCustomExpInfo("a_1", "0.1");
        a1Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }
    
    {
        GameSpeed = theory.createMilestoneUpgrade(1, 2);
        GameSpeed.description = Localization.getUpgradeIncCustomDesc("Speed", "100 \\%");
        GameSpeed.info = Localization.getUpgradeIncCustomInfo("Speed", "100 \\%");
        GameSpeed.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }
    
    {
        moreK = theory.createMilestoneUpgrade(3, 1);
        moreK.description = "$\\uparrow$ K max level by 10";
        moreK.info = "Increases maximum level of K by 10";
        moreK.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
        moreK.canBeRefunded = (_) => k.level <= 20;
    }
    
    {
        moreTerm = theory.createMilestoneUpgrade(4, 1);
        moreTerm.description = Localization.getUpgradeAddTermDesc("a_3");
        moreTerm.info = Localization.getUpgradeAddTermInfo("a_3");
        moreTerm.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }
    
    updateAvailability();
}
var updateAvailability = () => {
    let bf = (num) => BigNumber.from(num);
    
    GameSpeed.isAvailable = theory.tau >= bf(1e50);
    moreK.isAvailable = theory.tau >= bf(1e40);
    moreTerm.isAvailable = theory.tau >= bf(1e100);
    
    a3.isAvailable = moreTerm.level >= 1;
    
    if (moreK.level >= 1) k.maxLevel = 30;
    else k.maxLevel = 20;
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
    
    // Q calc
    let Q = getQ(q.level);
    
    if(Aq < Q * 4000 && Aq > bf(0)) Aq += Q * dt / bf(20);
    else Aq = Q * 4000;
    
    // final calc
    let upTerm = getA1(a1.level).pow(ExpA1) * Aq;
    upTerm += getA2(a2.level) * bf(Aq).pow(bf(2));
    if (moreTerm.level >= 1) upterm += getA3(a3.level) * Aq.pow(bf(3));
    
    // game speed
    let stage = 2;
    
    // rho adding
    dotrho = upTerm / div2 / bf(stage) * bf(2).pow(bf(GameSpeed.level));
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
    result += " q + a_2 q^{2}"
    if (moreTerm.level >= 1) result += " + a_3 q^{3} ";
    result += "}{\\mid \\varrho \\mid + 10^{-k}}";
    return result;
}

var getSecondaryEquation = () => {
    theory.secondaryEquationHeight = 80;
    let result = "\\varrho = \\sum_{n=0}^{\\vartheta} \\frac{(-1)^{n} x^{2n+1}}{(2n+1)!}";
    result += "\\qquad" + theory.latexSymbol + "=\\max\\rho";
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
    postQ = getQ(q.level) / bf(20);
}
var postPublish = () => {
    x = BigNumber.ZERO;
    Aq = Aq / BigNumber.THREE;
    if (Aq >= postQ * 1500) Aq = postQ * 1500;
    Aq += BigNumber.ONE;
}

var getEquationOverlay = (_) => {
    let result = ui.createLatexLabel({text: version, displacementY: 4, displacementX: 4, fontSize: 9, textColor: Color.TEXT_MEDIUM});
    return result;
}

var getPublicationMultiplier = (tau) => tau.pow(0.23) / BigNumber.THREE;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.23}}{3}";
var getTau = () => currency1.value;
var get2DGraphValue = () => currency1.value.sign * (BigNumber.ONE + currency1.value.abs()).log10().toNumber();


var getA1 = (level) => BigNumber.TWO.pow(level);
var getA2 = (level) => BigNumber.TWO.pow(level);
var getA3 = (level) => BigNumber.TWO.pow(level);
var getQ = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getK = (level) => BigNumber.from(level * 0.05);
var getDT = (level) => BigNumber.from(12 * level + 8);
init();
