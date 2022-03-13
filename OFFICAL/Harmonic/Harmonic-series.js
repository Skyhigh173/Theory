import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "Harmonic-series_SUM";
var name = "Harmonic-series";
var description = "A basic theory.";
var authors = "Skyhigh173#3120";
var version = "v0.0.1";

var currency;
var a1 = BigNumber.ONE, a2 = BigNumber.ONE;
var a3 = BigNumber.ONE, a4 = BigNumber.ONE;
var n1 = BigNumber.ONE;

var b1 = BigNumber.ZERO, b2 = BigNumber.ZERO, b3 = BigNumber.ZERO, b4 = BigNumber.ZERO;
var db1 = BigNumber.ZERO, db2 = BigNumber.ZERO, db3 = BigNumber.ZERO, db4 = BigNumber.ZERO;

var a3T, a4T, b2T, b3T, b4T;


quaternaryEntries = [];
var chapter1, chapter2;

var init = () => {
    currency = theory.createCurrency();
    
    theory.primaryEquationHeight = 75;
    theory.primaryEquationScale = 0.75;

    ///////////////////
    // Regular Upgrades

    // a1
    {
        let getDesc = (level) => "a_1=2^{" + level + "}";
        let getInfo = (level) => "a_1=" + getA1(level).toString(0);
        a1 = theory.createUpgrade(0, currency, new ExponentialCost(1, Math.log2(7)));
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
    
    // n1
    {
        let getDesc = (level) => "n_1=" + getN1(level).toString(0);
        n1 = theory.createUpgrade(2, currency, new ExponentialCost(100000, Math.log2(12)));
        n1.getDescription = (_) => Utils.getMath(getDesc(n1.level));
        n1.getInfo = (amount) => Utils.getMathTo(getDesc(n1.level), getDesc(n1.level + amount));
    }
    
    // db1
    {
        let getDesc = (level) => "\\dot{d}_1=" + getDB1(level).toString(0);
        db1 = theory.createUpgrade(3, currency, new ExponentialCost(10, Math.log2(3)));
        db1.getDescription = (_) => Utils.getMath(getDesc(db1.level));
        db1.getInfo = (amount) => Utils.getMathTo(getDesc(db1.level), getDesc(db1.level + amount));
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e10);
    theory.createBuyAllUpgrade(1, currency, 1e13);
    theory.createAutoBuyerUpgrade(2, currency, 1e30);

    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(25, 25));

    
    
    /////////////////
    //// Achievements
    

    ///////////////////
    //// Story chapters
    chapter1 = theory.createStoryChapter(0, "Harmonic series", "This is line 1,\nand this is line 2.\n\nNice.", () => a1.level > 0);
    chapter2 = theory.createStoryChapter(1, "My Second Chapter", "This is line 1 again,\nand this is line 2... again.\n\nNice again.", () => a2.level > 0);

    updateAvailability();
}

var updateAvailability = () => {
    
}


//tick
var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    
    b1 = b1 + dt * getDB1(db1.level);
    
    
    
    currency.value += dt * bonus * ( (getA1(a1.level) * getA2(a2.level)).pow(0.5) * getN1(n1.level) + BigNumber.from(b1) );
}


//Equation
var getPrimaryEquation = () => {
    let result = "\\lim_{k \\rightarrow  \\infty } \\sum_{n=1}^{k}  \\frac{1}{n}";
    result += " \\\\\\ ";
    result += "\\dot{\\rho} =  \\sqrt{a_1 a_2 a_3 a_4} \\cdot n_1 + b_1";

    

    return result;
}

var getSecondaryEquation = () => theory.latexSymbol + "=\\max\\rho";


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
var getN1 = (level) => Utils.getStepwisePowerSum(level, 2, 6, 1);
var getDB1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 1);


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
    
    

    return quaternaryEntries;
}



init();
