/*
| quick theory thats fun (?)
*/

import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";
import { Popup } from "../api/ui/Popup";
import { Color } from "../api/ui/properties/Color";
import { ImageSource } from "../api/ui/properties/ImageSource";
import { Thickness } from "../api/ui/properties/Thickness";
import { ui } from "../api/ui/UI"

var id = "Limit";
var name = "Limit Value";
var description = "My another fun and quick theory";
var authors = "Skyhigh173#3120";
var version = "0.1";

var currency;
var a1, a2, a3, a4;
var infoUnlock;

var init = () => {
    currency = theory.createCurrency();
    
    //a1 
    {
        let getDesc = (level) => "a_1=" + getA1(level);
        a1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(5, Math.log2(1.98))));
        a1.getDescription = (_) => Utils.getMath(getDesc(a1.level));
        a1.getInfo = (amount) => Utils.getMathTo(getDesc(a1.level), getDesc(a1.level + amount));
        a1.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); };
    }
    
    //a2
    {
        let getDesc = (level) => "a_2=" + getA2(level);
        a2 = theory.createUpgrade(1, currency, new ExponentialCost(20, Math.log2(1.8)));
        a2.getDescription = (_) => Utils.getMath(getDesc(a2.level));
        a2.getInfo = (amount) => Utils.getMathTo(getDesc(a2.level), getDesc(a2.level + amount));
        a2.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); };
    }
    
    //a3
    {
        let getDesc = (level) => "a_3=2^{" + getA3(level) + "}";
        a3 = theory.createUpgrade(2, currency, new ExponentialCost(150, Math.log2(4.2)));
        a3.getDescription = (_) => Utils.getMath(getDesc(a3.level));
        a3.getInfo = (amount) => Utils.getMathTo(getDesc(a3.level), getDesc(a3.level + amount));
        a3.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); };
    }
    
    //a4
    {
        let getDesc = (level) => "a_4=" + getA4(level);
        a4 = theory.createUpgrade(3, currency, new ExponentialCost(140, Math.log2(1.97)));
        a4.getDescription = (_) => Utils.getMath(getDesc(a4.level));
        a4.getInfo = (amount) => Utils.getMathTo(getDesc(a4.level), getDesc(a4.level + amount));
        a4.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); };
    }
    
    theory.createPublicationUpgrade(0, currency, 1e10);
    theory.createBuyAllUpgrade(1, currency, 1e13);
    theory.createAutoBuyerUpgrade(2, currency, 1e30);
    
    theory.setMilestoneCost(new LinearCost(20, 20));
    
        
    {
        infoUnlock = theory.createMilestoneUpgrade(0, 1);
        infoUnlock.getDescription = (amount) => "Unlock info";
        infoUnlock.getInfo = (amount) => "Unlocks q info";
        infoUnlock.boughtOrRefunded = (_) => { theory.invalidateTertiaryEquation(); updateAvailability(); }
    }
    
    
    
    updateAvailability();
}

var updateAvailability = () => {
    
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    
    let va1 = getA1(a1.level);
    let va2 = getA2(a2.level);
    let va3 = getA3(a3.level);
    let va4 = getA4(a4.level);
    
    let t1 = va1 * va2;
    let tq = va4 - va1;
    tq = tq / BigNumber.TEN;
    if (tq < BigNumber.ZERO) tq = BigNumber.ZERO;
    
    let tF = t1 + va3 * tq;
    
    currency.value += dt * bonus * tF;
    theory.invalidateTertiaryEquation();
}

var getPrimaryEquation = () => {
    let result = "\\dot{\\rho} = a_1 a_2 + a_3 q";

    return result;
}

var getSecondaryEquation = () => {
    let result = "q = \\max(0,\\frac{a_4 - a_1}{10})";
    return result;
}
var getTertiaryEquation = () => {
    let result = theory.latexSymbol + "=\\max\\rho";
    let q = getA4(a4.level) - getA1(a1.level);
    if (q < BigNumber.ZERO) q = 0;
    if (infoUnlock.level >= 1) result += " \\qquad a_4 - a_1 =" + q;
    return result;
}

var getPublicationMultiplier = (tau) => tau.pow(0.164) / BigNumber.TEN;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.164}}{10}";
var getTau = () => currency.value;
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getA1 = (level) => Utils.getStepwisePowerSum(level, 2, 8, 0);
var getA2 = (level) => Utils.getStepwisePowerSum(level, 2, 9, 1);
var getA3 = (level) => BigNumber.TWO.pow(level);
var getA4 = (level) => Utils.getStepwisePowerSum(level, 2, 8, 5);

init();
