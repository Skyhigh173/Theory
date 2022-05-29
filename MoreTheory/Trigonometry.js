import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

// Trigonometry
// at start i dont think it will be well balanced :O
var id = "Triangle?";
var name = "Trigonometry";
var description = "Trigonometry, talks about sin() cos() tan() and more!";
var authors = "Skyhigh173#3120";
var version = 1.1;

var currency1;
var a1, a2;
var a1Exp, GameSpeed;
var q, k, vdt;
var Aq = BigNumber.ONE;
var x = BigNumber.ZERO;
var dotrho, div;

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
    // q
    {
        let getDesc = (level) => "\\dot{q}=" + getQ(level) / BigNumber.from(20);
        q = theory.createUpgrade(2, currency1, new ExponentialCost(10, Math.log2(4.8)));
        q.getDescription = (_) => Utils.getMath(getDesc(q.level));
        q.getInfo = (amount) => Utils.getMathTo(getDesc(q.level), getDesc(q.level + amount));
    }
    /* x
    {
        let getDesc = (level) => "x=e \\times " + getX(level).toString(0);
        let getInfo = (level) => "x=" + getX(level).toString(0);
        x = theory.createUpgrade(3, currency, new ExponentialCost(100, Math.log2(2.3)));
        x.getDescription = (_) => Utils.getMath(getDesc(x.level));
        x.getInfo = (amount) => Utils.getMathTo(getInfo(x.level), getInfo(x.level + amount));
    }
    */
    // k
    {
        let getDesc = (level) => "k=" + getK(level).toString(2);
        let getInfo = (level) => "k=" + getK(level).toString(2);
        k = theory.createUpgrade(4, currency1, new ExponentialCost(100, Math.log2(90)));
        k.getDescription = (_) => Utils.getMath(getDesc(k.level));
        k.getInfo = (amount) => Utils.getMathTo(getInfo(k.level), getInfo(k.level + amount));
        k.maxLevel = 20;
        // k = -0 -> k = 1 (step = 0.05)
    }
     // vdt
    {
        let getDesc = (level) => "\\vartheta =" + getDT(level).toString(0);
        vdt = theory.createUpgrade(5, currency1, new ExponentialCost(25, Math.log2(4)));
        vdt.getDescription = (_) => Utils.getMath(getDesc(vdt.level));
        vdt.getInfo = (amount) => Utils.getMathTo(getDesc(vdt.level), getDesc(vdt.level + amount));
    }
    
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency1, 1e10);
    theory.createBuyAllUpgrade(1, currency1, 1e13);
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
        GameSpeed = theory.createMilestoneUpgrade(1, 1);
        GameSpeed.description = Localization.getUpgradeIncCustomDesc("Speed", "100 \\%");
        GameSpeed.info = Localization.getUpgradeIncCustomInfo("Speed", "100 \\%");
        GameSpeed.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }
    
    updateAvailability();
}
var updateAvailability = () => {
    
}
var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    
    // bignumber setup
    let bf = (num) => BigNumber.from(num);
    let bpi = BigNumber.TWO;
    
    x += bf(0.125) * dt;
    div = bf(1);
    // if x is greater then vdt*pi/4, it grows by x^2 not sin(x).
    if (x > getDT(vdt.level) * bpi / bf(4)) div = (x - getDT(vdt.level) * bpi / bf(4)).pow(bpi) + x.sin();
    else div = x.sin();
    let div2 = div.abs() + BigNumber.TEN.pow(bf(0) - getK(k.level)); //10^(-k)
    
    let ExpA1 = bf(1 + a1Exp.level / 10);
    
    let Q = getQ(q.level);
    Aq += Q * dt / bf(20);
    let upTerm = getA1(a1.level).pow(ExpA1) * Aq + getA2(a2.level) * Aq.pow(bf(2));
    
    let stage = 3;
    
    dotrho = upTerm / div2 / bf(stage) * bf(2).pow(bf(GameSpeed.level));
    if (a1.level == 0) {
        dotrho = bf(0);
        x = bf(0);
    }
    currency1.value += dotrho * bonus * dt;
    theory.invalidateTertiaryEquation();
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
    result += " q + a_2 q^{2}}{\\mid \\varrho \\mid + 10^{-k}}";
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

var postPublish = () => {
    x = BigNumber.ZERO;
    Aq = BigNumber.ONE;
}

var getPublicationMultiplier = (tau) => tau.pow(0.164) / BigNumber.THREE;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.164}}{3}";
var getTau = () => currency1.value;
var get2DGraphValue = () => currency1.value.sign * (BigNumber.ONE + currency1.value.abs()).log10().toNumber();


var getA1 = (level) => BigNumber.TWO.pow(level);
var getA2 = (level) => BigNumber.TWO.pow(level);
var getQ = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getK = (level) => BigNumber.from(level * 0.05);
var getDT = (level) => BigNumber.from(15 * level + 8);
init();
