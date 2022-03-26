import { ExponentialCost, FirstFreeCost, LinearCost } from "../api/Costs";
import { Localization } from "../api/Localization";
import { parseBigNumber, BigNumber } from "../api/BigNumber";
import { theory } from "../api/Theory";
import { Utils } from "../api/Utils";

var id = "Exponential_integral";
var name = "Exponential Integral";
var description = "Exponential integral";
var authors = "Skyhigh173";
var version = 1;

var currency;
var x, y, z, k1, k2, alpha;
var UnlockFractor;
var xF, yF, zF;
var q = 0;

var init = () => {
    currency = theory.createCurrency();

    ///////////////////
    // Regular Upgrades
    
    // x
    {
        let getDesc = (level) => "x=" + getX(level).toString(0);
        x = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(5, Math.log2(1.2))));
        x.getDescription = (_) => Utils.getMath(getDesc(x.level));
        x.getInfo = (amount) => Utils.getMathTo(getDesc(x.level), getDesc(x.level + amount));
    }

    // y
    {
        let getDesc = (level) => "y=" + getY(level).toString(0);
        y = theory.createUpgrade(1, currency, new ExponentialCost(40, Math.log2(1.9)));
        y.getDescription = (_) => Utils.getMath(getDesc(y.level));
        y.getInfo = (amount) => Utils.getMathTo(getDesc(y.level), getDesc(y.level + amount));
    }
       
    // z
    {
        let getDesc = (level) => "z=" + getZ(level).toString(0);
        z = theory.createUpgrade(2, currency, new ExponentialCost(600, Math.log2(2.3)));
        z.getDescription = (_) => Utils.getMath(getDesc(z.level));
        z.getInfo = (amount) => Utils.getMathTo(getDesc(z.level), getDesc(z.level + amount));
    }
    
    // k1
    {
        let getDesc = (level) => "k_1=" + getK1(level).toString(0);
        k1 = theory.createUpgrade(3, currency, new ExponentialCost(20, Math.log2(2.5)));
        k1.getDescription = (_) => Utils.getMath(getDesc(k1.level));
        k1.getInfo = (amount) => Utils.getMathTo(getDesc(k1.level), getDesc(k1.level + amount));
    }
      
    // k2
    {
        let getDesc = (level) => "k_2=2^{" + level + "}";
        let getInfo = (level) => "k_2=" + getK2(level).toString(0);
        k2 = theory.createUpgrade(4, currency, new ExponentialCost(40, Math.log2(3.2)));
        k2.getDescription = (_) => Utils.getMath(getDesc(k2.level));
        k2.getInfo = (amount) => Utils.getMathTo(getInfo(k2.level), getInfo(k2.level + amount));
    }
    
    // alpha
    {
        let getDesc = (level) => "\\alpha=" + getALP(level).toString(0);
        alpha = theory.createUpgrade(5, currency, new ExponentialCost(100, Math.log2(4)));
        alpha.getDescription = (_) => Utils.getMath(getDesc(alpha.level));
        alpha.getInfo = (amount) => Utils.getMathTo(getDesc(alpha.level), getDesc(alpha.level + amount));
    }
    
    updateAvailability();
}

var updateAvailability = () => {
    
}


var tick = (elapsedTime, multiplier) => {
    let bonus = theory.publicationMultiplier;
    let dt = BigNumber.from(elapsedTime * multiplier);
    q += elapsedTime;
    let totalXYZ = getX(x.level).pow(0.5) * getY(y.level).pow(0.7) * getZ(z.level);
    let sinOutPut = getALP(alpha.level) / 1.5 + Math.sin(q);
    let KTotal = getK1(k1.level) * getK2(k2.level) * sinOutPut;
    currency.value += dt * bonus * BigNumber.from(totalXYZ + KTotal);
    theory.invalidateTertiaryEquation();
    
}

var getPrimaryEquation = () => {
    theory.primaryEquationHeight = 80;
    let result = "E(x)= \\int_{- \\infty}^{x} \\frac{e^t}{t}dt \\\\\\ ";
    if (1 == 0) {
        result += "";
    } else {
        result +="\\dot{\\rho}=  x^{0.5}  y^{0.7}  z  + k_1 k_2 \\times (\\alpha\\frac{1}{1.5} + \\sin(q))";
    }
    return result;
}

var getSecondaryEquation = () => {
    let result = "\\dot{q} = 1";
    return result;
}


var getTertiaryEquation = () => {
    let result = "q=";
    result += q;
    return result;
}
var getX = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getY = (level) => Utils.getStepwisePowerSum(level, 2, 7, 1);
var getZ = (level) => Utils.getStepwisePowerSum(level, 2, 5, 1);
var getK1 = (level) => Utils.getStepwisePowerSum(level, 3, 8, 1);
var getK2 = (level) => BigNumber.TWO.pow(level);
var getALP = (level) => Utils.getStepwisePowerSum(level, 5, 8, 1);

var getPublicationMultiplier = (tau) => tau.pow(0.198) / BigNumber.TEN;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.198}}{10}";
var getTau = () => currency.value;
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

init();
