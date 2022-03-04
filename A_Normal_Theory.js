import { ExponentialCost, FirstFreeCost, LinearCost } from "../api/Costs";
import { Localization } from "../api/Localization";
import { BigNumber, parseBigNumber } from "../api/BigNumber";
import { theory } from "../api/Theory";
import { Utils } from "../api/Utils";


var id = "Nothin";
var name = "A normal theory";
var description = "This theory is normal. Your goal is to ██████. Thats cool! GLHF ";
var version = "Alpha 0.0.1";

var currency;
var a1, b1;
var a1Exp, b1Exp;

var achievement1;
var chapter1;

var init = () => {
  currency = theory.createCurrency();
  
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
  
  {
    a1Exp = theory.createMilestoneUpgrade(0, 3);
    a1Exp.description = Localization.getUpgradeIncCustomExpDesc("a_1", "0.05");
    a1Exp.info = Localization.getUpgradeIncCustomExpInfo("a_1", "0.05");
    a1Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
  }

  {
    b1Exp = theory.createMilestoneUpgrade(1, 3);
    b1Exp.description = Localization.getUpgradeIncCustomExpDesc("b_1", "0.05");
    b1Exp.info = Localization.getUpgradeIncCustomExpInfo("b_1", "0.05");
    b1Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
  }
  
  /////////////////
  //// Achievements
  achievement1 = theory.createAchievement(0, "A new start", "Buy a1", () => a1.level > 1);
  
  ///////////////////
  //// Story chapters
  chapter1 = theory.createStoryChapter(0, "News", "One day morning,\nyou see a strange formula.\nWhat is it?nYou decided to research it.", () => currency.value == 0);
  
  updateAvailability();
}

var updateAvailability = () => {
  b1Exp.isAvailable = a1Exp.level > 0;
}

var tick = (elapsedTime, multiplier) => {
  let dt = BigNumber.from(elapsedTime * multiplier);
  let bonus = theory.publicationMultiplier;
  currency.value += bonus * dt *getA1(a1.level).pow(getA1Exponent(a1Exp.level)) * getB1(b1.level).pow(getB1Exponent(b1Exp.level));
}

var getPrimaryEquation = () => {
    let result = "\\dot{\\rho} = c_1";

    if (a1Exp.level == 1) result += "^{0.05}";
    if (a1Exp.level == 2) result += "^{0.1}";
    if (a1Exp.level == 3) result += "^{0.15}";
    return result;
}

var getPublicationMultiplier = (tau) => tau.pow(0.164) / BigNumber.THREE;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.164}}{3}";
var getTau = () => currency.value;
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getA1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getB1 = (level) => BigNumber.TWO.pow(level);
var getA1Exponent = (level) => BigNumber.from(1 + 0.05 * level);
var getB1Exponent = (level) => BigNumber.from(1 + 0.05 * level);

init();
