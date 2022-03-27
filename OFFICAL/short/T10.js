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
