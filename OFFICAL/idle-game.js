import { ExponentialCost, FirstFreeCost, LinearCost } from "../api/Costs";
import { Localization } from "../api/Localization";
import { parseBigNumber, BigNumber } from "../api/BigNumber";
import { theory } from "../api/Theory";
import { Utils } from "../api/Utils";

var id = "idle-game";
var name = "Idle Game";
var description = "yes it is a idle game. trust me";
var authors = "skyhigh173";
var version = 1;

var currency;
var Pub, BuyAll, Auto;
var PubBonus;
var a1, a2, a3, a4;


var init = () => {
    currency = theory.createCurrency();

    ///////////////////
    // Regular Upgrades
    
    //a1 
    {
        let getDesc = (level) => "a_1=" + (0.1 * a1.level);
        a1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(1, Math.log2(2))));
        a1.getDescription = (_) => Utils.getMath(getDesc(a1.level));
        a1.getInfo = (amount) => "+ " + getPubPerSecMulti(0.1) + " /sec";
        a1.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); };
    }
       
    //a2
    {
        let getDesc = (level) => "a_2=" + (10 * a2.level);
        a2 = theory.createUpgrade(1, currency, new ExponentialCost(500, Math.log2(2.5)));
        a2.getDescription = (_) => Utils.getMath(getDesc(a2.level));
        a2.getInfo = (amount) => "+ " + getPubPerSecMulti(10) + " /sec";
        a2.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); };
    }
    //a3
    {
        let getDesc = (level) => "a_3=" + (80 * a3.level);
        a3 = theory.createUpgrade(2, currency, new ExponentialCost(6000, Math.log2(5)));
        a3.getDescription = (_) => Utils.getMath(getDesc(a3.level));
        a3.getInfo = (amount) => "+ " + getPubPerSecMulti(80) + " /sec";
        a3.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); };
        a3.isAvailable = false;
    }
    
    /////////////////////
    // Permanent Upgrades
    Pub = theory.createPublicationUpgrade(0, currency, 100);
    Pub.isAvailable = false;
    BuyAll = theory.createBuyAllUpgrade(1, currency, 1e13);
    BuyAll.isAvailable = false;
    Auto = theory.createAutoBuyerUpgrade(2, currency, 1e30);
    Auto.isAvailable = false;
    
    theory.setMilestoneCost(new LinearCost(0, 10));
    
    updateAvailability();
}

var updateAvailability = () => {
    Pub.isAvailable = (a1.level > 5);
    BuyAll.isAvailable = a2.level > 10;
    Auto.isAvailable = a2.level > 100;
    
    a3.isAvailable = a2.level >= 4;
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    
    let TotalA = getA1(a1.level) + getA2(a2.level) + getA3(a3.level);
    currency.value += bonus * dt * TotalA;
}

var getPrimaryEquation = () => {
    let result = "\\sum_{i=1}^{} a_i";
    return result;
}

var getSecondaryEquation = () => theory.latexSymbol + "=\\max\\rho";

var getPublicationMultiplier = (tau) => tau.pow(0.389) / BigNumber.TWO;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.389}}{2}";
var getTau = () => currency.value;
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

function getPubPerSecMulti (plus) {
    return BigNumber.from(plus);
}

var getA1 = (level) => BigNumber.from(level * 0.1);
var getA2 = (level) => BigNumber.from(level * 10);
var getA3 = (level) => BigNumber.from(level * 80);

init();
