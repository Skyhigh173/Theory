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
        let getDesc = (level) => "\\dot{q}_1=" + getDQ1(level).toString(0) + "\\times q_2";
        let getInfo = (level) => "\\dot{q}_1=" + (getDQ1(level) * q2).toString();
        D1 = theory.createUpgrade(0, currency, new FreeCost());
        D1.getDescription = (amount) => Utils.getMath(getDesc(dq1.level));
        D1.getInfo = (amount) => Utils.getMathTo(getInfo(dq1.level), getInfo(dq1.level + amount));
    }
