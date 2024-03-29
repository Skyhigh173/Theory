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

var id = "Harmonic-series_SUM";
var name = "Harmonic-series";
var description = "A basic theory.";
var authors = "Skyhigh173#3120";
var version = "v0.0.2";

var currency;
var a1 = BigNumber.ONE, a2 = BigNumber.ONE;
var a3 = BigNumber.ONE, a4 = BigNumber.ONE;
var n1 = BigNumber.ONE;

var b1 = BigNumber.ZERO, b2 = BigNumber.ONE, b3 = BigNumber.ONE, b4 = BigNumber.ONE;
var db1 = BigNumber.ZERO, db2 = BigNumber.ZERO, db3 = BigNumber.ZERO, db4 = BigNumber.ZERO;

var aTs, bTs;
var starU, stars = BigNumber.ZERO;


quaternaryEntries = [];
var chapter1, chapter2;

var init = () => {
    currency = theory.createCurrency();
    
    theory.primaryEquationHeight = 75;
    theory.primaryEquationScale = 1;

    ///////////////////
    // Regular Upgrades

    //// a terms
    
    // a1
    {
        let getDesc = (level) => "a_1=2^{" + level + "}";
        let getInfo = (level) => "a_1=" + getA1(level).toString(0);
        a1 = theory.createUpgrade(0, currency, new ExponentialCost(1, Math.log2(5)));
        a1.getDescription = (_) => Utils.getMath(getDesc(a1.level));
        a1.getInfo = (amount) => Utils.getMathTo(getInfo(a1.level), getInfo(a1.level + amount));
    }
    
    // a2
    {
        let getDesc = (level) => "a_2=" + getA2(level).toString(0);
        a2 = theory.createUpgrade(1, currency, new ExponentialCost(30, Math.log2(2)));
        a2.getDescription = (_) => Utils.getMath(getDesc(a2.level));
        a2.getInfo = (amount) => Utils.getMathTo(getDesc(a2.level), getDesc(a2.level + amount));
    }
    // a3
    {
        let getDesc = (level) => "a_3=" + getA3(level).toString(0);
        a3 = theory.createUpgrade(2, currency, new ExponentialCost(100000, Math.log2(6)));
        a3.getDescription = (_) => Utils.getMath(getDesc(a3.level));
        a3.getInfo = (amount) => Utils.getMathTo(getDesc(a3.level), getDesc(a3.level + amount));
        a3.isAvailable = false;
    }
   
    // a4
    {
        let getDesc = (level) => "a_4=" + getA4(level).toString(0);
        a4 = theory.createUpgrade(3, currency, new ExponentialCost(1000000, Math.log2(10)));
        a4.getDescription = (_) => Utils.getMath(getDesc(a4.level));
        a4.getInfo = (amount) => Utils.getMathTo(getDesc(a4.level), getDesc(a4.level + amount));
        a4.isAvailable = false;
    }
    
    //// n terms
    
    // n1
    {
        let getDesc = (level) => "n_1=" + getN1(level).toString(0);
        n1 = theory.createUpgrade(100, currency, new ExponentialCost(10, Math.log2(18)));
        n1.getDescription = (_) => Utils.getMath(getDesc(n1.level));
        n1.getInfo = (amount) => Utils.getMathTo(getDesc(n1.level), getDesc(n1.level + amount));
    }
    
    //// b terms
    
    // db1
    {
        let getDesc = (level) => "\\dot{b}_1=" + getDB1(level).toString(0) + (bTs.level > 0 ? "\\cdot b_2" : "");
        db1 = theory.createUpgrade(1000, currency, new ExponentialCost(10, Math.log2(3)));
        db1.getDescription = (_) => Utils.getMath(getDesc(db1.level));
        db1.getInfo = (amount) => Utils.getMathTo(getDesc(db1.level), getDesc(db1.level + amount));
    }
    
    // db2
    {
        let getDesc = (level) => "\\dot{b}_2=" + getDB2(level).toString(0) + (bTs.level > 1 ? "\\cdot b_3" : "");
        db2 = theory.createUpgrade(1001, currency, new ExponentialCost(10000, Math.log2(5)));
        db2.getDescription = (_) => Utils.getMath(getDesc(db2.level));
        db2.getInfo = (amount) => Utils.getMathTo(getDesc(db2.level), getDesc(db2.level + amount));
        db2.isAvailable = false;
    }
    
    // db3
    {
        let getDesc = (level) => "\\dot{b}_3=" + getDB2(level).toString(0) + (bTs.level > 2 ? "\\cdot b_4" : "");
        db3 = theory.createUpgrade(1002, currency, new ExponentialCost(80000, Math.log2(7)));
        db3.getDescription = (_) => Utils.getMath(getDesc(db3.level));
        db3.getInfo = (amount) => Utils.getMathTo(getDesc(db3.level), getDesc(db3.level + amount));
        db3.isAvailable = false;
    }
    // db4
    {
        let getDesc = (level) => "\\dot{b}_4=" + getDB2(level).toString(0);
        db4 = theory.createUpgrade(1003, currency, new ExponentialCost(500000, Math.log2(9)));
        db4.getDescription = (_) => Utils.getMath(getDesc(db4.level));
        db4.getInfo = (amount) => Utils.getMathTo(getDesc(db4.level), getDesc(db4.level + amount));
        db4.isAvailable = false;
    }
    
    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e1);
    theory.createBuyAllUpgrade(1, currency, 1e13);
    theory.createAutoBuyerUpgrade(2, currency, 1e30);
    

    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(1, 1));
    //terms and new variables
    {
        aTs = theory.createMilestoneUpgrade(0, 2);
        aTs.getDescription = (_) => Localization.getUpgradeUnlockDesc(aTs.level == 0 ? "a_3" : "a_4");
        aTs.getInfo = (_) => Localization.getUpgradeUnlockInfo(aTs.level == 0 ? "a_3" : "a_4");
        aTs.boughtOrRefunded = (_) => { updateAvailability(); theory.invalidatePrimaryEquation(); };
    }
    
    {
        bTs = theory.createMilestoneUpgrade(1, 3);
        bTs.getDescription = (_) => Localization.getUpgradeUnlockDesc(bTs.level == 0 ? "b_2" : (bTs.level == 1 ? "b_3" : "b_4") );
        bTs.getInfo = (_) => Localization.getUpgradeUnlockInfo(bTs.level == 0 ? "b_2" : (bTs.level == 1 ? "b_3" : "b_4") );
        bTs.boughtOrRefunded = (_) => { updateAvailability(); theory.invalidatePrimaryEquation(); };
    }
    //others unlock
    {
        starU = theory.createMilestoneUpgrade(100, 1);
        starU.getDescription = (_) => Localization.getUpgradeUnlockDesc("\\star");
        starU.getInfo = (_) => Localization.getUpgradeUnlockInfo("\\star");
        starU.canBeRefunded = (_) => false;
    }

    
    
    /////////////////
    //// Achievements
    

    ///////////////////
    //// Story chapters
    chapter1 = theory.createStoryChapter(0, "Harmonic series", "This is line 1,\nand this is line 2.\n\nNice.", () => a1.level > 0);
    chapter2 = theory.createStoryChapter(1, "My Second Chapter", "This is line 1 again,\nand this is line 2... again.\n\nNice again.", () => a2.level > 1000);

    updateAvailability();
}

var updateAvailability = () => {
    a3.isAvailable = aTs.level > 0;
    a4.isAvailable = aTs.level > 1;
    db2.isAvailable = bTs.level > 0;
    db3.isAvailable = bTs.level > 1;
    db4.isAvailable = bTs.level > 2;
}


//tick
var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    
    b1 = b1 + dt * getDB1(db1.level) * (bTs.level > 0 ? b2 : BigNumber.ONE) ; 
    if (bTs.level > 0) b2 = b2 + dt * getDB2(db2.level) * (bTs.level > 1 ? b3 : BigNumber.ONE) ; 
    if (bTs.level > 1) b3 = b3 + dt * getDB3(db3.level) * (bTs.level > 2 ? b4 : BigNumber.ONE) ; 
    if (bTs.level > 2) b4 = b4 + dt * getDB4(db4.level);
    
    let A3T = aTs.level > 0 ? (getA3(a3.level)) : (BigNumber.ONE);
    let A4T = aTs.level > 1 ? (getA4(a4.level)) : (BigNumber.ONE);
    
    if (starU.level > 0) {
        if ( Math.random() < 0.05 ) {
            stars += 1;
            theory.invalidateTertiaryEquation();
        }
    }
    
    currency.value += dt * bonus * ( (getA1(a1.level) * getA2(a2.level) * A3T * A4T).pow(0.5) * getN1(n1.level) + BigNumber.from(b1));
    
    theory.invalidateQuaternaryValues();
}

var postPublish = () => {
    b1 = BigNumber.ONE;
    b2 = BigNumber.ONE;
    b3 = BigNumber.ONE;
    b4 = BigNumber.ONE;
}

//Equation
var getPrimaryEquation = () => {
    let result = "\\lim_{k \\rightarrow  \\infty } \\sum_{n=1}^{k}  \\frac{1}{n}";
    result += " \\\\\\ ";
    result += "\\dot{\\rho} =  \\sqrt{a_1 a_2";
    if ( aTs.level > 0 ) result += " a_3";
    if ( aTs.level > 1 ) result += " a_4";
    result += "} \\cdot n_1 + b_1";
    

    

    return result;
}

var getSecondaryEquation = () => " ";
var getTertiaryEquation = () => {
    let result = theory.latexSymbol + "=\\max\\rho";
    if (starU.level > 0) result += "\\qquad \\star = " + BigNumber.from(stars).toString(0);
    return result;
}
    

//Multiplier
var getPublicationMultiplier = (tau) => tau.pow(0.164) / BigNumber.THREE;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.164}}{3}";

//Tau
var getTau = () => currency.value;

//Graph
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

//get value
var getA1 = (level) => BigNumber.TWO.pow(level);
var getA2 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 1);
var getA3 = (level) => Utils.getStepwisePowerSum(level, 2, 5, 1);
var getA4 = (level) => Utils.getStepwisePowerSum(level, 3, 4, 1);
var getN1 = (level) => Utils.getStepwisePowerSum(level, 2, 6, 1);
var getDB1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getDB2 = (level) => Utils.getStepwisePowerSum(level, 2, 8, 0);
var getDB3 = (level) => Utils.getStepwisePowerSum(level, 2, 6, 0);
var getDB4 = (level) => Utils.getStepwisePowerSum(level, 2, 4, 0);

////////////////side variables/////////////
var getQuaternaryEntries = () => {
    if (quaternaryEntries.length == 0)
    {
        quaternaryEntries.push(new QuaternaryEntry("b_1", null));
        quaternaryEntries.push(new QuaternaryEntry("b_2", null));
        quaternaryEntries.push(new QuaternaryEntry("b_3", null));
        quaternaryEntries.push(new QuaternaryEntry("b_4", null));
        
    }

    quaternaryEntries[0].value = b1.toString();
    quaternaryEntries[1].value = bTs.level > 0 ? b2.toString() : null;
    quaternaryEntries[2].value = bTs.level > 1 ? b3.toString() : null;
    quaternaryEntries[3].value = bTs.level > 2 ? b4.toString() : null;

    return quaternaryEntries;
}



init();


/////////////POPUP////////////////////
