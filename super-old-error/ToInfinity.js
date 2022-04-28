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
    currency.value *= currency.vaule.pow(currency.value);
}

var getPrimaryEquation = () => "\\dot{\\rho} = TREE(3)";
var getPublicationMultiplier = (tau) => tau.pow(0.164) / BigNumber.THREE;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.164}}{3}";
var getTau = () => currency.value;
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

init();
