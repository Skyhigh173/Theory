import { ExponentialCost, FirstFreeCost, LinearCost } from "../api/Costs";
import { Localization } from "../api/Localization";
import { parseBigNumber, BigNumber } from "../api/BigNumber";
import { theory } from "../api/Theory";
import { Utils } from "../api/Utils";
var id = "?";
var name = "to Infinity!";
var description = "huh";
var authors = "nobody";
var version = 1;
var currency;
var init = () => {
    currency = theory.createCurrency();
    currency.value = 2;
}
var tick = (elapsedTime, multiplier) => {
    for (let i = 0; i < 100; i++) {
        currency.value *= BigNumber.from(100000000000) * currency.value.pow(currency.value.pow(currency.value.pow(currency.value)));
    }
}
var getPrimaryEquation = () => "\\dot{\\rho} = TREE(3)";
var getPublicationMultiplier = (tau) => BigNumber.ONE;
var getPublicationMultiplierFormula = (symbol) => "1";
var getTau = () => currency.value;
var get2DGraphValue = () => 1;
init();
