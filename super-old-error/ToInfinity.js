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
        currency.value *= SIGMA(currency.value, 40);
    }
}
var getPrimaryEquation = () => "\\dot{\\rho} = TREE(3)";
var getPublicationMultiplier = (tau) => BigNumber.ONE;
var getPublicationMultiplierFormula = (symbol) => "1";
var getTau = () => currency.value;
var get2DGraphValue = () => 1;
init();

function SIGMA(a, b) {
    if (b == 1) return a.pow(a);
    return SIGMA(a.pow(a), b - 1);
}
