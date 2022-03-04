import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";


var id = "sus";
var name = "My Theory";
var description = "Welcome! In this theory, you need to #%&#@=$#=)&*#$";
var authors = "skyhigh173#3120";
var version = 0;


var currency;
var a;


var init = () => {
  currency = theory.createCurrency();
  theory.primaryEquationHeight=1;
  a = 1;
  /////////////////
  //Regular Upgrades

  //a

  {
    let getDesc = (level) => "a" + geta(level).toString(0);
    a = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(1, Math.log2(2))));
    a.getDescription = (_) => Utils.getMath(getDesc(a.level));
    a.getInfo = (amount) => Utils.getMathTo(getDesc(a.level),getDesc(tai.level + amount));
  }
 
  /////////////////
  //Permanent Upgrades
  theory.createPublicationUpgrade(0, currency, 1e7);
  theory.createBuyAllUpgrade(1, currency, 1e8);
  theory.createAutoBuyerUpgrade(2, currency, 1e10);
  /////////////////
  //// Achievements

  ///////////////////
  //// Story chapters
  
  updateAvailability();
}

var getPrimaryEquation = () => {
  let result = "a\\sqrt{a}";
  return result;
}
