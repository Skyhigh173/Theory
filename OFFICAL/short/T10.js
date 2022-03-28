import { ExponentialCost, FirstFreeCost, LinearCost } from "../api/Costs";
import { Localization } from "../api/Localization";
import { BigNumber, parseBigNumber } from "../api/BigNumber";
import { theory } from "../api/Theory";
import { Utils } from "../api/Utils";

var id = "Leibniz-Limit"
var name = "Leibniz Limit";
var description = "more fun equation, just like t9";
var authors = "Skyhigh173";
var version = 1;

var b1, b2, a1, a2, q1, TotalUpgrade;
var currency;

var init = () => {
    currency = theory.createCurrency();

    ///////////////////
    // Regular Upgrades
    
    // b1
    {
        let getDesc = (level) => "b_1=2^{" + level + "}";
        let getInfo = (level) => "b_1=" + getB1(level).toString(0);
        b1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(10, Math.log2(2.6))));
        b1.getDescription = (_) => Utils.getMath(getDesc(b1.level));
        b1.getInfo = (amount) => Utils.getMathTo(getInfo(b1.level), getInfo(b1.level + amount));
    }
    
    // b2
    {
        let getDesc = (level) => "b_2=" + getB2(level).toString(0);
        b2 = theory.createUpgrade(1, currency, new ExponentialCost(5, Math.log2(1.97)));
        b2.getDescription = (_) => Utils.getMath(getDesc(b2.level));
        b2.getInfo = (amount) => Utils.getMathTo(getDesc(b2.level), getDesc(b2.level + amount));
    }
        
    // a1
    {
        let getDesc = (level) => "a_1=" + getA1(level).toString(0);
        a1 = theory.createUpgrade(2, currency, new ExponentialCost(150, Math.log2(1.5)));
        a1.getDescription = (_) => Utils.getMath(getDesc(a1.level));
        a1.getInfo = (amount) => Utils.getMathTo(getDesc(a1.level), getDesc(a1.level + amount));
        a1.isAutoBuyable = false;
        a1.canBeRefunded = (_) => true;
    }
      
    // a2
    {
        let getDesc = (level) => "a_2=" + getA2(level).toString(0);
        a2 = theory.createUpgrade(3, currency, new ExponentialCost(200, Math.log2(1.5)));
        a2.getDescription = (_) => Utils.getMath(getDesc(a2.level));
        a2.getInfo = (amount) => Utils.getMathTo(getDesc(a2.level), getDesc(a2.level + amount));
        a2.isAutoBuyable = false;
        a2.canBeRefunded = (_) => true;
    }
       
    // q1
    {
        let getDesc = (level) => "q_1=" + getQ1(level).toString(0);
        q1 = theory.createUpgrade(4, currency, new ExponentialCost(1000, Math.log2(6)));
        q1.getDescription = (_) => Utils.getMath(getDesc(q1.level));
        q1.getInfo = (amount) => Utils.getMathTo(getDesc(q1.level), getDesc(q1.level + amount));
    }
    
      
    
    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e8);
    theory.createBuyAllUpgrade(1, currency, 1e13);
    theory.createAutoBuyerUpgrade(2, currency, 1e26);
    
    
    updateAvailability();
}

var updateAvailability = () => {
