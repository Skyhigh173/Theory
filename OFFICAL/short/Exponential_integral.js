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
var x, y, z, C, n;
var UnlockFractor;
var xF, yF, zF;
var q;

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
        z = theory.createUpgrade(2, currency, new FirstFreeCost(new ExponentialCost(600, Math.log2(2.3))));
        z.getDescription = (_) => Utils.getMath(getDesc(z.level));
        z.getInfo = (amount) => Utils.getMathTo(getDesc(z.level), getDesc(z.level + amount));
    }
    
    updateAvailability();
}

var updateAvailability = () => {
    
}


var tick = (elapsedTime, multiplier) => {
    let bonus = theory.publicationMultiplier;
    let dt = = BigNumber.from(elapsedTime * multiplier);
    q += elapsedTime;
    currency.value += 0;
}

var getPrimaryEquation = () => {
    let result = "E(x)= \\int_{- \\infty}^{x} \\frac{e^t}{t}dt \\\\\\ ";
    if (UnlockFractor.level > 0) {
        
    } else {
        result +="\\dot{\\rho}=  x^{0.5}  y^{0.7}  z  + k_1 k_2 \\times (\\alpha\frac{1}{1.5} + \\sin(q))";
    }
    return result;
}

var getSecondaryEquation = () => {
    let result = "\\dot{q} = 1";
}

var getTertiaryEquation = () => {
    let result = "q=";
    result += q;
    return result;
}

var getPublicationMultiplier = (tau) => tau.pow(0.198) / BigNumber.TEN;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.198}}{10}";
var getTau = () => currency.value;
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

init();
