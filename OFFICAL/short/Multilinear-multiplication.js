import { ExponentialCost, FirstFreeCost, LinearCost } from "../api/Costs";
import { Localization } from "../api/Localization";
import { parseBigNumber, BigNumber } from "../api/BigNumber";
import { theory } from "../api/Theory";
import { Utils } from "../api/Utils";


var id = "Multilinear-multiplication";
var name = "Multilinear multiplication";
var description = "Multi";
var authors = "Sky";
var version = 1;

var currency;
var Q, a1, a2, K, P;
var alpha, beta;

var init = () => {
    currency = theory.createCurrency();

    ///////////////////
    // Regular Upgrades

    // Q
    {
        let getDesc = (level) => "Q=" + getQ(level).toString(0);
        Q = theory.createUpgrade(0, currency, new FreeCost());
        Q.getDescription = (_) => Utils.getMath(getDesc(Q.level));
        Q.getInfo = (amount) => Utils.getMathTo(getDesc(Q.level), getDesc(Q.level + amount));
    }
  
    // a1
    {
        let getDesc = (level) => "a_1=2^{" + level + "}";
        let getInfo = (level) => "a_1=" + getA1(level).toString(0);
        a1 = theory.createUpgrade(1, currency, new ExponentialCost(10, Math.log2(2.3)));
        a1.getDescription = (_) => Utils.getMath(getDesc(a1.level));
        a1.getInfo = (amount) => Utils.getMathTo(getInfo(a1.level), getInfo(a1.level + amount));
    }
      
    // a2
    {
        let getDesc = (level) => "a_2=" + getA2(level).toString(0);
        a2 = theory.createUpgrade(2, currency, new ExponentialCost(20, Math.log2(1.9)));
        a2.getDescription = (_) => Utils.getMath(getDesc(a2.level));
        a2.getInfo = (amount) => Utils.getMathTo(getDesc(a2.level), getDesc(a2.level + amount));
    }
