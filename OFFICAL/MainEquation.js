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
            let XLV = getX_Lv(level).toString(0);
            if (XLV >= 50) {
                result += "2^{3} \\times";
            } else if (XLV >= 25) {
                result += "2^{2} \\times";
            } else if (XLV >= 10) {
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
        let getDesc = (level) => "y = z + " + getY_Lv(level).toString(0);
        y = theory.createUpgrade(0, ft, new FreeCost());
        y.getDescription = (_) => Utils.getMath(getDesc(y.level));
        y.getInfo = (amount) => Utils.getMathTo(getDesc(y.level), getDesc(y.level + amount));
    }
    
}


var getX_Lv = (level) => BigNumber.from(level / 10);
var getX = (level) => BigNumber.from(getY(y.level) + level / 10);
var getY_Lv = (level) => BigNumber.from(
