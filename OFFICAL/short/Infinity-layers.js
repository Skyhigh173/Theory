import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "IL";
var name = "Infinity Layers";
var description = "A basic theory.";
var authors = "=)";
var version = 1;

var currency1, currency2;
var a1, a2, a3, a4, a5;

var init = () => {
    currency1 = theory.createCurrency();

    ///////////////////
    // Regular Upgrades

    // a1
    {
        let getDesc = (level) => " \\alpha_1=" + getA1(level).toString(0);
        a1 = theory.createUpgrade(0, currency1, new FirstFreeCost(new ExponentialCost(10, Math.log2(3.2))));
        a1.getDescription = (_) => Utils.getMath(getDesc(a1.level));
        a1.getInfo = (amount) => Utils.getMathTo(getDesc(a1.level), getDesc(a1.level + amount));
    }
    
    // a2
    {
        let getDesc = (level) => " \\alpha_2=" + getA2(level).toString(0);
        a2 = theory.createUpgrade(1, currency1, new ExponentialCost(1e300, Math.log2(4)));
        a2.getDescription = (_) => Utils.getMath(getDesc(a2.level));
        a2.getInfo = (amount) => Utils.getMathTo(getDesc(a2.level), getDesc(a2.level + amount));
    }
    
    // a3
    {
        let getDesc = (level) => " \\alpha_3=" + getA3(level).toString(0);
        a3 = theory.createUpgrade(2, currency1, new ExponentialCost(BigNumber.from("ee8.5"), 100));
        a3.getDescription = (_) => Utils.getMath(getDesc(a3.level));
        a3.getInfo = (amount) => Utils.getMathTo(getDesc(a3.level), getDesc(a3.level + amount));
    }
    
    // a4
    {
        let getDesc = (level) => " \\alpha_4=" + getA4(level).toString(0);
        a4 = theory.createUpgrade(3, currency1, new ExponentialCost(BigNumber.from("ee14"), 1e5));
        a4.getDescription = (_) => Utils.getMath(getDesc(a4.level));
        a4.getInfo = (amount) => Utils.getMathTo(getDesc(a4.level), getDesc(a4.level + amount));
    }
    
    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency1, BigNumber.from("ee4"));
    theory.createBuyAllUpgrade(1, currency1, BigNumber.from("ee20"));
    theory.createAutoBuyerUpgrade(2, currency1, BigNumber.from("ee1000"));
    
    updateAvailability();
}
var updateAvailability = () => {
    
}
var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    currency1.value += getA1(a1.level);
}

var getPrimaryEquation = () => {
    let result = "\\dot{\\rho} = \\aleph_0";


    return result;
}

var getPublicationMultiplier = (tau) => tau.pow(0.001) / BigNumber.HUNDRED;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.001}}{100}";
var getTau = () => currency1.value;
var get2DGraphValue = () => currency1.value.sign * (BigNumber.ONE + currency1.value.abs()).log10().toNumber();

var getA1 = (level) => Utils.getStepwisePowerSum(level, 4, 3, 0) + BigNumber.from(getA2(a2.level));
var getA2 = (level) => Utils.getStepwisePowerSum(level, 120, 2, 0) + BigNumber.from(getA3(a3.level));
var getA3 = (level) => Utils.getStepwisePowerSum(level, 1e16, 2, 0) + BigNumber.from(getA4(a4.level));
var getA4 = (level) => Utils.getStepwisePowerSum(level, 1e30, 2, 0);

init();
