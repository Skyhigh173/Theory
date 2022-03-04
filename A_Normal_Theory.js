import { ExponentialCost, FirstFreeCost, LinearCost } from "../api/Costs";
import { Localization } from "../api/Localization";
import { BigNumber, parseBigNumber } from "../api/BigNumber";
import { theory } from "../api/Theory";
import { Utils } from "../api/Utils";

//for exponential idle
//By skyhigh173
// skyhigh173#3120

var id = "Nothin";
var name = "A normal theory";
var description = "This theory is normal. Your goal is to ██████. Thats cool! GLHF ";
var version = "Alpha 0.0.1";

var currency;
var a1, b1;
var a1Exp, a2Exp;

var achievement1;
var chapter 1;

var init = () => {
  currency = theory.createCurrency()
  
  ///////////////////
  // Regular Upgrades

  // a1
  let getDesc = (level) => "a_1=" + getA1(level).toString(0);
  a1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(1, Math.log2(2))));
  a1.getDescription = (_) => Utils.getMath(getDesc(a1.level));
  a1.getInfo = (amount) => Utils.getMathTo(getDesc(a1.level), getDesc(a1.level + amount));
  
  // b1
  let getDesc = (level) => "b_1=" + getB1(level).toString(0);
  b1 = theory.createUpgrade(1, currency, new FirstFreeCost(new ExponentialCost(5, Math.log2(12))));
  b1.getDescription = (_) => Utils.getMath(getDesc(b1.level));
  b1.getInfo = (amount) => Utils.getMathTo(getDesc(b1.level), getDesc(b1.level + amount));
  
  /////////////////////
  // Permanent Upgrades
  theory.createPublicationUpgrade(0, currency, 10000);
  theory.createBuyAllUpgrade(1, currency, 1e10);
  theory.createAutoBuyerUpgrade(2, currency, 1e18);
  
  ///////////////////////
  //// Milestone Upgrades
  theory.setMilestoneCost(new LinearCost(25, 25));
  
