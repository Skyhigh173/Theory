import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "MAIN";
var name = "exponential idle";
var description = "Your first theory";
var authors = "Gilles-Philippe Paillé \n Recreate:Skyhigh173";
var version = "v1.0.0";

var ft, μ, ψ;
var c1, c2;
var x, y, z;

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
         
            let result = "y = z + ";
            let YLV = getY_Last(y.level).toString(0);
            if (y.level >= 50) {
                result += "2^{3} \\times";
            } else if (y.level >= 25) {
                result += "2^{2} \\times";
            } else if (y.level >= 10) {
                result += "2 \\times";
            }

            result += YLV;
            return result;
        }
        y = theory.createUpgrade(1, ft, new CustomCost( VariableCost(y.level, 0.5, -4.143474, 1.04) ));
        y.getDescription = (_) => Utils.getMath(getDesc(y.level));
        y.getInfo = (amount) => Utils.getMathTo(getDesc(y.level), getDesc(y.level + amount));
    }
    
}



function VariableCost(level, a, b, base) {
    let BaseCost = a * (level - 1) + b;
    let PowerCost = BaseCost.pow(2);
    let FinalCost = PowerCost.pow(2);
    return FinalCost;
}

var getX_Last = (level) => BigNumber.from(level / 10);
var getX = (level) => BigNumber.from(getY(y.level) + level / 10);
var getY_Last = (level) => BigNumber.from(level);
var getY = (level) => BigNumber.from();
