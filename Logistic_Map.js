import { ExponentialCost, FirstFreeCost } from "../api/Costs";
import { Localization } from "../api/Localization";
import { BigNumber } from "../api/BigNumber";
import { theory } from "../api/Theory";
import { Utils } from "../api/Utils";

var id = "LGMP"
var name = "Logistic Map";
var description = "Logistic map, cool and good ouo";
var authors = "Gilles-Philippe Paillé";
var version = 1;

// 2D graph
var r, x, loopn, totaloop;
var dr; // speed 
var rStart; //milestone, start with r 1/2/3, n < r < 4

var currency;
// L = total loops
// currency +=  sqrt(c1c2c3r + L) * k1 k2 / 50

var k1, k2, c1, c2, c3;

var init = () => {
    currency = theory.createCurrency();

    /////////////////////
    // Regular Upgrades
        // dr
    {
        let getDesc = (level) => "\\dot{S}_{peed}=" + getDR(level).toString(0);
        let getInfo = (level) => "Total inscreases speed $=" + getSpeed().toString(0) + "$x";
        dr = theory.createUpgrade(0, currency, new ExponentialCost(500, Math.log2(5.6)));
        dr.getDescription = (amount) => Utils.getMath(getDesc(dr.level));
        dr.getInfo = (amount) => getInfo(dr.level);
        dr.maxLevel = 20;
    }
