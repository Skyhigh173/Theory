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
var EXP3, DPT;
var EXPName = ["u_x","u_x","u_y","u_y","u_z","u_z"];
var U = BigNumber.ZERO;
var currency;

var init = () => {
    currency = theory.createCurrency();

    ///////////////////
    // Regular Upgrades

    // c
    {
        let getDesc = (level) => "c=" + getC(level).toString(0);
        c = theory.createUpgrade(0, currency, new ExponentialCost(500, Math.log2(1.985)));
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
        y.getInfo = (amount) => Utils.getMathTo(getDesc(y.level), getDesc(y.level + amount));
    }
    
    // z
    {
        let getDesc = (level) => "u_z = " + level + "^{ e^{1.6} / \\sqrt[4]{1 + " + x.level + "}}";
        z = theory.createUpgrade(3, currency, new ExponentialCost(400, Math.log2(2.4)));
        z.getDescription = (_) => Utils.getMath(getDesc(z.level));
        z.getInfo = (amount) => Utils.getMathTo(getZ(z.level), getZ(z.level + amount));
    }
       
    
    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e8);
    theory.createBuyAllUpgrade(1, currency, 1e13);
    theory.createAutoBuyerUpgrade(2, currency, 1e30);
    
    //ach (τ?)
    theory.createAchievement(0, "start your journey", "Reach 1 rho", () => currency.value >= 1);
    theory.createAchievement(1, "variable z is a lie", "Reach 10000 rho", () => currency.value >= 10000);
    theory.createAchievement(2, "useless variable", "Reach 4 τ", () => theory.tau >= 4);
    theory.createAchievement(3, "Publication speed", "Reach 1e8 rho", () => currency.value >= 1e8);
    theory.createAchievement(4, "Need help", "buy a exponent upgrade", () => EXP3.level >= 1);
    theory.createAchievement(5, "Speed : MAX", "buy all exponent upgrade", () => EXP3.level >= 6);
    theory.createAchievement(6, "wonderful int", "buy a dp upgrade", () => DPT.level >= 1);

    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(1, 1));
    
    {
        EXP3 = theory.createMilestoneUpgrade(0, 6);
        EXP3.description = Localization.getUpgradeIncCustomExpDesc(EXPName[EXP3.level], "0.25");
        EXP3.info = Localization.getUpgradeIncCustomExpInfo(EXPName[EXP3.level], "0.25");
        EXP3.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }
        
    {
        DPT = theory.createMilestoneUpgrade(1, 1);
        DPT.description = Localization.getUpgradeUnlockDesc("d \\bar{p}");
        DPT.info = Localization.getUpgradeUnlockInfo("d \\bar{p}");
        DPT.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }
    updateAvailability();
}
var updateAvailability = () => {
    
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    
   
    if (x.level != 0) {
        
        let XEXP = getEXPNum(EXP3.level, 1);
        let YEXP = getEXPNum(EXP3.level, 2);
        let ZEXP = getEXPNum(EXP3.level, 3);
        
        dp = BigNumber.ONE;
        if (DPT.level > 0) dp += ClacDP().pow(BigNumber.from(0.4));
        
        U += dp * dt * getC(c.level) * ( getX(x.level).pow(XEXP) + getY(y.level).pow(YEXP) + getZ(z.level).pow(ZEXP) );
        
        
        currency.value += bonus * dt * BigNumber.from(U) / getC(c.level).pow(2);
    }
    
    theory.invalidatePrimaryEquation();
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
    result += " ) \\\\\\ \\dot{\\rho} =  \\frac{ \\partial^2 u}{\\partial c^2}";
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
    //  from 0 to C : tar = w
    //  (0 Down / C Up) => (x + y + z + w) dw
    let w = BigNumber.from(getC(c.level)); //w = c
    
    return BigNumber.from(w * ((w + 2 * ( getX(x.level) + getY(y.level) + getZ(z.level) ) ) / 2));
    //idk ouop = hard to write on programme
    
}

var getSecondaryEquation = () => theory.latexSymbol + "=\\max\\rho^{0.1}";

var getTertiaryEquation = () => "u =" + BigNumber.from(U);

var getPublicationMultiplier = (tau) => tau.pow(2.4) / BigNumber.TEN;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{2.4}}{10}";
var getTau = () => currency.value.pow(0.1);
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getC = (level) => Utils.getStepwisePowerSum(level, 2, 8, 1);
var getX = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getY = (level) => BigNumber.TWO.pow(level);
var getZ = (level) => {
    let index = BigNumber.E.pow(1.6) / ( BigNumber.from(x.level + 1).sqrt() );
    return BigNumber.from(level).pow(index);
}

init();
