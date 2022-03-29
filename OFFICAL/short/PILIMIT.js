import { ExponentialCost, FirstFreeCost, LinearCost } from "../api/Costs";
import { Localization } from "../api/Localization";
import { BigNumber, parseBigNumber } from "../api/BigNumber";
import { theory } from "../api/Theory";
import { Utils } from "../api/Utils";

var id = "Leibniz-Limit"
var name = "Leibniz Limit";
var description = "more fun equation, just like t9";
var authors = "Skyhigh173";
var version = 1;

var b1, b2, a1, a2, q1, TotalUpgrade = 0, q = 0, qExp;
var currency;

var init = () => {
    currency = theory.createCurrency();
    theory.primaryEquationHeight = 70;
    theory.secondaryEquationHeight = 60;
    theory.tertiaryEquationHeight = 40;

    ///////////////////
    // Regular Upgrades
    
    // b1
    {
        let getDesc = (level) => "b_1=2^{" + level + "}";
        let getInfo = (level) => "b_1=" + getB1(level).toString(0);
        b1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(10, Math.log2(3.8))));
        b1.getDescription = (_) => Utils.getMath(getDesc(b1.level));
        b1.getInfo = (amount) => Utils.getMathTo(getInfo(b1.level), getInfo(b1.level + amount));
    }
    
    // b2
    {
        let getDesc = (level) => "b_2=" + getB2(level).toString(0);
        b2 = theory.createUpgrade(1, currency, new ExponentialCost(5, Math.log2(2.5)));
        b2.getDescription = (_) => Utils.getMath(getDesc(b2.level));
        b2.getInfo = (amount) => Utils.getMathTo(getDesc(b2.level), getDesc(b2.level + amount));
    }
        
    // a1
    {
        let getDesc = (level) => "a_1=" + getA1(level).toString(0);
        a1 = theory.createUpgrade(2, currency, new ExponentialCost(10000, Math.log2(1.5)));
        a1.getDescription = (_) => Utils.getMath(getDesc(a1.level));
        a1.getInfo = (amount) => Utils.getMathTo(getDesc(a1.level), getDesc(a1.level + amount));
        a1.isAutoBuyable = false;
        a1.canBeRefunded = (_) => true;
    }
      
    // a2
    {
        let getDesc = (level) => "a_2=" + getA2(level).toString(0);
        a2 = theory.createUpgrade(3, currency, new ExponentialCost(10000, Math.log2(1.5)));
        a2.getDescription = (_) => Utils.getMath(getDesc(a2.level));
        a2.getInfo = (amount) => Utils.getMathTo(getDesc(a2.level), getDesc(a2.level + amount));
        a2.isAutoBuyable = false;
        a2.canBeRefunded = (_) => true;
    }
       
    // q1
    {
        let getDesc = (level) => "q_1=" + getQ1(level).toString(0);
        q1 = theory.createUpgrade(4, currency, new ExponentialCost(8000, Math.log2(9)));
        q1.getDescription = (_) => Utils.getMath(getDesc(q1.level));
        q1.getInfo = (amount) => Utils.getMathTo(getDesc(q1.level), getDesc(q1.level + amount));
    }
    
      
    
    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e8);
    theory.createBuyAllUpgrade(1, currency, 1e13);
    theory.createAutoBuyerUpgrade(2, currency, 1e26);
    
    
    updateAvailability();
}

var updateAvailability = () => {
    
}
var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    
    TotalUpgrade = BigNumber.from(a1.level + a2.level + b1.level + b2.level + q1.level);
    q += Math.floor(elapsedTime * 10) / 10;
    qExp = TotalUpgrade / 500;
    let bSUM = getB1(b1.level) * getB2(b2.level) - q.pow(BigNumber.from(qExp));
    let piSUM = BigNumber.PI - (getA1(a1.level) / getA2(a2.level));
    
    currency.value += bSUM / piSUM;
    theory.invalidateTertiaryEquation();
}

var getPrimaryEquation = () => {
    let result = "( b_1 b_2 / q^{";
    result += TotalUpgrade / 500;
    result += "} ) \\div (\\pi - \\frac{a_1}{a_2})";
    return result;
}

var getSecondaryEquation = () => {
    let result = "\\pi = \\int_{0}^{1} \\left( \\sum_{k=0}^{n} (-1)^k x^{2k} + \\frac{(-1)^{n+1} x^{2n+2}}{1+ x^2} \\right) dx";
    return result;
}

var getTertiaryEquation = () => {
    let result = "q^{";
    result += qExp;
    result += "} = ";
    result += (q.pow(BigNumber.from(qExp));
    result += "\\qquad \\frac{a_1}{a_2} =";
    result += getA1(a1.level) / getA2(a2.level);
    return result;
}

var getPublicationMultiplier = (tau) => tau.pow(0.25) / BigNumber.THREE;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.25}}{3}";
var getTau = () => currency.value;
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getB1 = (level) => BigNumber.TWO.pow(level);
var getB2 = (level) => Utils.getStepwisePowerSum(level, 2, 8, 1);
var getA1 = (level) => 1 + BigNumber.from(level);
var getA2 = (level) => 1 + BigNumber.from(level);
var getQ1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 1);




init();

