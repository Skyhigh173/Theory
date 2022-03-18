import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "MAIN";
var name = "exponential idle CT version";
var description = "Your first theory";
var authors = "Gilles-Philippe Paillé \n Recreate:Skyhigh173";
var version = "v1.0.0";

var ft, μ, ψ;
var x, y, z, s;

var init = () => {
    ft = theory.createCurrency("ft", "f(t)");
    μ = theory.createCurrency("μ", "\\mu");
    ψ = theory.createCurrency("ψ", "\\psi");
    
    ////////////////////////////////////////////////
    
    ///////////////////
    // Regular Upgrades
    
    
    // x
    {
        let getDesc = (level) => {
         
            let result = "x = y + ";
            let XLV = getX_Last(x.level).toString(0);
            if (x.level >= 50) {
                result += "2^{3} \\times";
            } else if (x.level >= 25) {
                result += "2^{2} \\times";
            } else if (x.level >= 10) {
                result += "2 \\times";
            }

            result += XLV;
            return result;
        }
        x = theory.createUpgrade(0, ft, new FreeCost());
        x.getDescription = (_) => Utils.getMath(getDesc(x.level));
        x.getInfo = (amount) => Utils.getMathTo(getDesc(x.level), getDesc(x.level + amount));
    }
    // y
    {
        let getDesc = (level) => {
         
            let Eq = "y = z + ";
            let YLV = getY_Last(y.level).toString(0);
            let YPow = VariablePower(y.level);
            let YPowTxt = PowerText(YPow);
            Eq += YPowTxt;
            Eq += YLV;
            return Eq;
        }
        y = theory.createUpgrade(1, ft, new CustomCost( VariableCost(y.level, 0.5, -4.143474, 1.04) ));
        y.getDescription = (_) => Utils.getMath(getDesc(y.level));
        y.getInfo = (amount) => Utils.getMathTo(getDesc(y.level), getDesc(y.level + amount));
    }
    
}


// Find the cost of a variable
function VariableCost(level, a, b, base) {
    let BaseCost = a * (level - 1) + b;
    let PowerCost = BaseCost.pow(2);
    let FinalCost = PowerCost.pow(2);
    return FinalCost;
}

// Find the power (level) of a variable
function VariablePower(level) {
    
    if (level >= 24000) {
        return Math.floor(260 + (level - 24000) / 400);
    } else if (level >= 10000) {
        return Math.floor(190 + (level - 10000) / 200);
    } else if (level >= 6000) {
        return Math.floor(150 + (level - 6000) / 100);
    } else if (level >= 1500) {
        return Math.floor(60 + (level - 1500) / 50);
    } else if (level >= 50) {
        return Math.floor(2 + (level - 50) / 25);
    } else if (level >= 25) {
        return 2;
    } else if (level >= 10) {
        return 1;
    } else {
        return 0;
    }
}

// Text the power of a variable
function PowerText(power) {
    let result = "";
 
    if (power == 1) {
        result += "2 \\times ";
    }
    if (power > 1) {
        result += "2^{";
        result += power;
        result += "} \\times ";
    }
    return result;
}

var getX_Last = (level) => BigNumber.from(level / 10);
var getX = (level) => BigNumber.from(getY(y.level) + level / 10);
var getY_Last = (level) => BigNumber.from(level);
var getY = (level) => BigNumber.from();
