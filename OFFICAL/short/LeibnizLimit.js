import { ExponentialCost, FirstFreeCost, LinearCost } from "../api/Costs";
import { Localization } from "../api/Localization";
import { parseBigNumber, BigNumber } from "../api/BigNumber";
import { theory } from "../api/Theory";
import { Utils } from "../api/Utils";

var id = "LeibnizLimit";
var name = "Leibniz Theory";
var description = "A theory thats limit to pi.";
var authors = "Skyhigh173";
var version = 1;

var k, q1, q2, q;
var autobuyer, q1Exp;
var currency;

var init = () => {
    currency = theory.createCurrency();

    ///////////////////
    // Regular Upgrades

    // k
    {
        let getDesc = (level) => "k=" + getK(level).toString(0);
        k = theory.createUpgrade(0, currency, new ExponentialCost(10, Math.log2(4.2)));
        k.getDescription = (_) => Utils.getMath(getDesc(k.level));
        k.getInfo = (amount) => Utils.getMathTo(getDesc(k.level), getDesc(k.level + amount));
        
    }
  

    // q1
    {
        let getDesc = (level) => "q_1=" + getQ1(level).toString(0);
        q1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(5, Math.log2(1.85))));
        q1.getDescription = (_) => Utils.getMath(getDesc(q1.level));
        q1.getInfo = (amount) => Utils.getMathTo(getDesc(q1.level), getDesc(q1.level + amount));
        
    }
        
    // q2 
    {
        let getDesc = (level) => "q_2=2^{" + level + "}";
        let getInfo = (level) => "q_2=" + getQ2(level).toString(0);
        q2 = theory.createUpgrade(1, currency, new ExponentialCost(100, Math.log2(3)));
        q2.getDescription = (_) => Utils.getMath(getDesc(q2.level));
        q2.getInfo = (amount) => Utils.getMathTo(getInfo(q2.level), getInfo(q2.level + amount));
        
    }





/*
function Limit (k) {
  let result = 0;
  for (let i = 0; i < k; i++) {
    result += Pi(i);
  }
  return result;
}

function Pi (n) {
  let upper = 2 * ((-1) ** (n)) * ((3) ** (1 / 2 - n));
  let lower = 2 * n + 1;
  return upper / lower;
}


*/
