import { ExponentialCost, FirstFreeCost, LinearCost } from "../api/Costs";
import { Localization } from "../api/Localization";
import { BigNumber, parseBigNumber } from "../api/BigNumber";
import { theory } from "../api/Theory";
import { Utils } from "../api/Utils";

var id = "T10"
var name = "T10";
var description = "more fun equation, just like t9";
var authors = "Skyhigh173";
var version = 1;

var b11, b12, a11, a12, q11, TotalUpgrade1;

var init = () => {
    currency = theory.createCurrency();

    ///////////////////
    // Regular Upgrades
    
    // b1
    {
        let getDesc = (level) => "c_1=" + getC11(level).toString(0);
        let getInfo = (level) => "c_1=" + getC11(level).toString(0);
        b11 = theory.createUpgrade(baseId + 0, currency, new FirstFreeCost(new ExponentialCost(5, Math.log2(2.6))));
        b11.getDescription = (amount) => Utils.getMath(getDesc(c11.level));
        cb1.getInfo = (amount) => Utils.getMathTo(getInfo(c11.level), getInfo(c11.level + amount));
    }
