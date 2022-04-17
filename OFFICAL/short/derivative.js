import { ExponentialCost, FirstFreeCost } from "../api/Costs";
import { Localization } from "../api/Localization";
import { parseBigNumber, BigNumber } from "../api/BigNumber";
import { theory } from "../api/Theory";
import { Utils } from "../api/Utils";

var id = "derivative"
var name = "Derivative";
var description = "derivative and derivative, also derivative";
var authors = "skyhigh173";
var version = 1;

var currency;
var D1, D2, D3, D4, D5;

var init = () => {
    currency = theory.createCurrency();

    ///////////////////
    // Regular Upgrades

    // D1
    {
        let getDesc = (level) => "D_1 =" + 
        D1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(5, Math.log2(1.6))));
        D1.getDescription = (amount) => Utils.getMath(getDesc(D1.level));
        D1.getInfo = "$D_1$ per second : ";
    }
