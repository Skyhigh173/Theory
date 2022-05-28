import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

// T9 : Trigonometry
var id = "Triangle?";
var name = "Trigonometry";
var description = "Trigonometry, talks about sin() cos() tan() and more!";
var authors = "Skyhigh173#3120";
var version = 1;

var currency1;
var a1, a2;
var a3, a4, a3Term, a4Term;
var q, k, vdt;
var x = BigNumber.ZERO;

var init = () => {
    currency1 = theory.createCurrency();
    
    // Regular upgrades
    
    // a1
    {
        let getDesc = (level) => "a_1=5^{" + level + "}";
        let getInfo = (level) => "a_1=" + getA1(level).toString(0);
        a1 = theory.createUpgrade(0, currency1, new FirstFreeCost(new ExponentialCost(5, Math.log2(3))));
        a1.getDescription = (_) => Utils.getMath(getDesc(a1.level));
        a1.getInfo = (amount) => Utils.getMathTo(getInfo(a1.level), getInfo(a1.level + amount));
    }
    // a2
    {
        let getDesc = (level) => "a_2=4^{" + level + "}";
        let getInfo = (level) => "a_2=" + getA2(level).toString(0);
        a2 = theory.createUpgrade(1, currency1, new ExponentialCost(50, Math.log2(2.8)));
        a2.getDescription = (_) => Utils.getMath(getDesc(a2.level));
        a2.getInfo = (amount) => Utils.getMathTo(getInfo(a2.level), getInfo(a2.level + amount));
    }
    // q
    {
        let getDesc = (level) => "q=1.9^{" + level + "}";
        let getInfo = (level) => "q=" + getQ(level).toString(0);
        q = theory.createUpgrade(2, currency1, new ExponentialCost(10, Math.log2(1.985)));
        q.getDescription = (_) => Utils.getMath(getDesc(q.level));
        q.getInfo = (amount) => Utils.getMathTo(getInfo(q.level), getInfo(q.level + amount));
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
        let getDesc = (level) => "x=e \\times " + getK(level).toString(0);
        let getInfo = (level) => "x=" + getK(level).toString(0);
        k = theory.createUpgrade(4, currency1, new ExponentialCost(100, Math.log2(2.3)));
        k.getDescription = (_) => Utils.getMath(getDesc(k.level));
        k.getInfo = (amount) => Utils.getMathTo(getInfo(k.level), getInfo(k.level + amount));
        k.maxLevel =  30;
        // k = -0.5 -> k = 1 (step = 0.05)
    }
     // vdt
    {
        let getDesc = (level) => "\\vartheta=" + getDT(level).toString(0);
        vdt = theory.createUpgrade(5, currency1, new ExponentialCost(8, Math.log2(2.5)));
        vdt.getDescription = (_) => Utils.getMath(getDesc(vdt.level));
        vdt.getInfo = (amount) => Utils.getMathTo(getDesc(vdt.level), getDesc(vdt.level + amount));
    }
    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency1, 1e10);
    theory.createBuyAllUpgrade(1, currency1, 1e13);
    theory.createAutoBuyerUpgrade(2, currency1, 1e30);
    
    updateAvailability();
}
var updateAvailability = () => {
    
}
var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    
    // bignumber setup
    let bf = (num) => BigNumber.from(num);
    let bpi = BigNumber.PI;
    
    x += bf(1) * dt;
    let div = bf(1);
    // if x is greater then vdt*pi/4, it grows by x^2 not sin(x).
    if (x > getDT(vdt.level) * bpi / bf(4)) div = (x - getDT(vdt.level) * bpi / bf(4)).pow(bpi);
    else div = x.sin();
    let div2 = div + BigNumber.TEN.pow(bf(0) - getK(k.level)); //10^(-k)
    div2 = div2.abs();
    
    let Q = getQ(q.level);
    let upTerm = getA1(a1.level) * Q + getA2(a2.level) * Q.pow(bf(2));
    let dotrho = upTerm / div2;
    currency1.value += dotrho * bonus * dt;
}

var getPrimaryEquation = () => {
    let result = "\\frac{a_1 q + a_2 q^{2}}{\\abs(\\varrho + 10^{-k})}"
    return result;
}

var getSecondaryEquation = () => {
    let result = "\\varrho = \\sum_{n=0}^{\\vartheta} \\frac{(-1)^{n} x^{2n+1}}{(2n+1)!}";
    return result;
}
var getTertiaryEquation = () => {
    return theory.latexSymbol + "=\\max\\rho";
}
var getPublicationMultiplier = (tau) => tau.pow(0.164) / BigNumber.THREE;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.164}}{3}";
var getTau = () => currency1.value;
var get2DGraphValue = () => currency1.value.sign * (BigNumber.ONE + currency1.value.abs()).log10().toNumber();

//var getA1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getA1 = (level) => BigNumber.FIVE.pow(level);
var getA2 = (level) => BigNumber.FOUR.pow(level);
var getQ = (level) => BigNumber.from(1.9).pow(level);
var getK = (level) => BigNumber.E * level;
var getDT = (level) => BigNumber.from(level + 5);
init();
