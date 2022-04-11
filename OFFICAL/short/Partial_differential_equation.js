import { ExponentialCost, FirstFreeCost, LinearCost } from "../api/Costs";
import { Localization } from "../api/Localization";
import { parseBigNumber, BigNumber } from "../api/BigNumber";
import { theory } from "../api/Theory";
import { Utils } from "../api/Utils";

var id = "PDE";
var name = "Partial differential equation";
var description = "partial differential equation (PDE) is an equation which imposes relations between the various partial derivatives of a multivariable function.";
var authors = "Skyhigh173";
var version = 2;

var c, x, y, z;
var dp;
var pubM;
var EXP3, DPT, UEXP, PERM;
var EXPName = ["u_x","u_x","u_y","u_y","u_z","u_z"];
var U = BigNumber.ZERO;
var currency;

var ac1, ac2, ac3;

var init = () => {
    currency = theory.createCurrency();

    ///////////////////
    // Regular Upgrades

    // c
    {
        let getDesc = (level) => "c=" + getC(level).toString(0);
        c = theory.createUpgrade(0, currency, new ExponentialCost(500, Math.log2(3.5)));
        c.getDescription = (_) => Utils.getMath(getDesc(c.level));
        c.getInfo = (amount) => Utils.getMathTo(getDesc(c.level), getDesc(c.level + amount));
    }
    
    // x
    {
        let getDesc = (level) => "u_x =" + getX(level).toString(0);
        x = theory.createUpgrade(1, currency, new FirstFreeCost(new ExponentialCost(50, Math.log2(1.8))));
        x.getDescription = (_) => Utils.getMath(getDesc(x.level));
        x.getInfo = (amount) => Utils.getMathTo(getDesc(x.level), getDesc(x.level + amount));
    }
    // y
    {
        let getDesc = (level) => "u_y = 2^{" + level + "}";
        y = theory.createUpgrade(2, currency, new ExponentialCost(20, Math.log2(2.4)));
        y.getDescription = (_) => Utils.getMath(getDesc(y.level));
        y.getInfo = (amount) => Utils.getMathTo(getY(y.level), getY(y.level + amount));
    }
    
    // z
    {
        let getDesc = (level) => "u_z = " + level + "^{ e^{1.6} / \\sqrt{1 + " + x.level + "}}";
        z = theory.createUpgrade(3, currency, new ExponentialCost(400, Math.log2(2.4)));
        z.getDescription = (_) => Utils.getMath(getDesc(z.level));
        z.getInfo = (amount) => Utils.getMathTo(getZ(z.level), getZ(z.level + amount));
    }
       
    
    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e8);
    theory.createBuyAllUpgrade(1, currency, 1e13);
    theory.createAutoBuyerUpgrade(2, currency, 1e30);
    
    {
        
        pubM = theory.createPermanentUpgrade(3, currency, new ExponentialCost(1e20, Math.log2(24)));
        pubM.getDescription = (_) => " $\\uparrow$ Pub multiplier by 0.5";
        pubM.getInfo = (amount) => "Increases Pub multiplier";
    }
    
    //ach (τ?)
    
    ac1 = theory.createAchievementCategory(0, "Progress");
    // Progress / rho
    theory.createAchievement(0, ac1, "Wonderful start", "Reach 1 rho", () => currency.value >= 1);
    theory.createAchievement(1, ac1, "Faster than a potato", "Reach 100 rho", () => currency.value >= 100);
    theory.createAchievement(2, ac1, "More speed!", "Reach 1e6 rho", () => currency.value >= 1e6);
    theory.createAchievement(3, ac1, "Going up", "Reach 1e10 rho", () => currency.value >= 1e10);
    theory.createAchievement(4, ac1, "Potato factory", "Reach 1e15 rho", () => currency.value >= 1e15);
    theory.createAchievement(5, ac1, "Another^2 start ", "Reach 1e30 rho", () => currency.value >= 1e30);
    theory.createAchievement(6, ac1, "gas gas gas", "Reach 1e50 rho", () => currency.value >= 1e50);
    
    ac2 = theory.createAchievementCategory(1, "Shadow");
    // these are shadow achievement. They are hard/need guide to reach but they are NOT secret ach
    theory.createAchievement(100, ac2, "Why you need to stop?", "variable z is greater than 1000", () => getZ(z.level) >= 1000);
    theory.createAchievement(101, ac2, "We cant use that thing", "reach 1e10 rho without variable y", () => y.level == 0 && currency.value >= 1e10);
    
    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(0, 2));
    
    {
        EXP3 = theory.createMilestoneUpgrade(0, 6);
        EXP3.description = Localization.getUpgradeIncCustomExpDesc("u_n", "0.25");
        EXP3.info = Localization.getUpgradeIncCustomExpInfo("u_n", "0.25");
        EXP3.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }
        
    {
        DPT = theory.createMilestoneUpgrade(1, 1);
        DPT.description = Localization.getUpgradeUnlockDesc("d \\bar{p}");
        DPT.info = Localization.getUpgradeUnlockInfo("d \\bar{p}");
        DPT.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
        
    }
        
    {
        UEXP = theory.createMilestoneUpgrade(2, 2);
        UEXP.description = Localization.getUpgradeDecCustomDesc("\\partial c", "0.6");
        UEXP.info = Localization.getUpgradeDecCustomInfo("\\partial c", "0.6");
        UEXP.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }
    
    {
        PERM = theory.createMilestoneUpgrade(3, 1);
        PERM.description = "Unlock Perm Upgrade";
        PERM.info = "Unlocks a new perm upgrade";
        PERM.boughtOrRefunded = (_) => updateAvailability();
    }
    updateAvailability();
}
var updateAvailability = () => {
    UEXP.isAvailable = currency.value >= 1e60;
    pubM.isAvailable = PERM.level == 1;
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    
   
    if (x.level != 0) {
        
        let XEXP = getEXPNum(EXP3.level, 1);
        let YEXP = getEXPNum(EXP3.level, 2);
        let ZEXP = getEXPNum(EXP3.level, 3);
        let Cpow = BigNumber.from(2);
        if (UEXP.level == 1) Cpow = BigNumber.from(1.4);
        if (UEXP.level == 2) Cpow = BigNumber.from(0.8);
        dp = BigNumber.ONE;
        let rdp = CalcDP();
        if (DPT.level > 0) dp += rdp.pow(BigNumber.from(0.4));
        
        U += dp * dt * getC(c.level) * ( getX(x.level).pow(XEXP) + getY(y.level).pow(YEXP) + getZ(z.level).pow(ZEXP) );
        
        
        currency.value += bonus * dt * BigNumber.from(U) / getC(c.level).pow(Cpow);
    }
    
    theory.invalidatePrimaryEquation();
    theory.invalidateSecondaryEquation();
    theory.invalidateTertiaryEquation();
}

var getInternalState = () => `${U}`

var setInternalState = (state) => {
    let values = state.split(" ");
    if (values.length > 0) U = parseBigNumber(values[0]);
}

var postPublish = () => {
    U = BigNumber.ZERO;
}

var getPrimaryEquation = () => {
    theory.primaryEquationHeight = 90;

    let result = "\\dot{u} = c ";
    if (DPT.level > 0) result += " \\times d \\bar{p} ";
    result += "\\times ( u_x";
    result += getEXPInfo(EXP3.level, 1);
    result += " + u_y";
    result += getEXPInfo(EXP3.level, 2);
    result += " + u_z";
    result += getEXPInfo(EXP3.level, 3);
    result += " ) \\\\\\ \\dot{\\rho} =  \\frac{ \\partial^2 u}{\\partial c^{";
    if (UEXP.level == 0) result += "2}";
    if (UEXP.level == 1) result += "1.4}";
    if (UEXP.level == 2) result += "0.8}";
    result += "}";
    return result;
}

function getEXPInfo (level, vari) {
    if (level == 0) {
        return "";
    } else {
        let minus = vari * 2 - 2;
        let FLV = level - minus;
        if (FLV <= 0) return "";
        if (FLV == 1) return "^{1.25}";
        if (FLV >= 2) return "^{1.5}";
    }
}
function getEXPNum (level, vari) {
    if (level == 0) {
        return BigNumber.ONE;
    } else {
        let minus = vari * 2 - 2;
        let FLV = level - minus;
        if (FLV <= 0) return BigNumber.ONE;
        if (FLV == 1) return BigNumber.from(1.25);
        if (FLV >= 2) return BigNumber.from(1.5);
    }
}

function CalcDP () {
    // int from 0 to C : tar = w
    // int (0 Down / C Up) => (x + y + z + w) dw
    let w = BigNumber.from(getC(c.level)); //w = c
    let result = BigNumber.from(w * ((w + 2 * ( getX(x.level) + getY(y.level) + getZ(z.level) ) ) / 2));
    result = BigNumber.ONE + result / BigNumber.from(9000); // try if this will work
    if (result >= BigNumber.From(20)) result = BigNumber.From(20);
    return result;
    //idk ouop = hard to write on programme
    //toooooo powerful i will div it by (idk) 1000? or 10000
    //powerful thing that mulitply the thing by ee10 (removed)
}



var getSecondaryEquation = () => {
    theory.secondaryEquationHeight = 60;
    if (DPT.level == 0) {
        return "";
    } else {
        return "p = \\int_{0}^{c} \\frac{ \\pi c^2}{uw}(w+u_x+u_y+u_z)dw";
    }
}

var getTertiaryEquation = () => theory.latexSymbol + "=\\max\\rho^{0.1} \\qquad u =" + BigNumber.from(U);

var getPublicationMultiplier = (tau) => tau.pow(2) / BigNumber.TEN * BigNumber.from(1 + pubM.level);
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{2}}{10} \\times " + (1 + pubM.level / 2);
var getTau = () => currency.value.pow(0.1);
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getC = (level) => Utils.getStepwisePowerSum(level, 2, 8, 1);
var getX = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getY = (level) => BigNumber.TWO.pow(level);
var getZ = (level) => {
    let index = BigNumber.E.pow(1.6) / ( BigNumber.from(x.level + BigNumber.ONE).sqrt() );
    return BigNumber.from(level).pow(index);
}

init();
