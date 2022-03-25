import { ExponentialCost, FirstFreeCost } from "../api/Costs";
import { Localization } from "../api/Localization";
import { parseBigNumber, BigNumber } from "../api/BigNumber";
import { theory } from "../api/Theory";
import { Utils } from "../api/Utils";

var id = "Vector_Calculus"
var name = "Vector Calculus";
var description = "A theory about Euclidean space.";
var authors = "Skyhigh173";
var version = "v0.0.1";

var Lemma;

var currency1, currency2, currency3;
var Unlock1, Unlock2, Unlock3; //Unlock
var x1, y1, z1; //Lemma 1
var k; //Lemma 2
var m; //Lemma 3

var init = () => {
    currency1 = theory.createCurrency();
    currency2 = theory.createCurrency();
    currency3 = theory.createCurrency();
    
    ///////////////////
    // Lemma& Unlock
    
    //Lemma, must put this thing else the lemma thing wont work
    {
        Lemma = theory.createUpgrade(0, currency1, new FreeCost());
        Lemma.description = Localization.getUpgradeProveLemma(1);
        Lemma.info = Localization.getUpgradeProveLemma(1);
        Lemma.boughtOrRefunded = (_) => theory.clearGraph();
        Lemma.isAvailable = false; // always unavailable
    }
    
    // Unlock rho 1 : Free
    {
        Unlock1 = theory.createUpgrade(1, currency1, new FreeCost());
        Unlock1.getDescription = (amount) => Localization.getUpgradeUnlockDesc("\\rho_1");
        Unlock1.getInfo = (amount) => Localization.getUpgradeUnlockInfo("\\rho_1");
        Unlock1.maxLevel = 1;
        Unlock1.isAvailable = false;
    }
    
    // Unlock rho 2 : need 1e50
    {
        Unlock2 = theory.createUpgrade(2, currency1, new ConstantCost(1e50));
        Unlock2.getDescription = (amount) => Localization.getUpgradeUnlockDesc("\\rho_2");
        Unlock2.getInfo = (amount) => Localization.getUpgradeUnlockInfo("\\rho_2");
        Unlock2.maxLevel = 1;
        Unlock2.isAvailable = false;
    }
    
    // Unlock rho 3 : need 1e75
    {
        Unlock3 = theory.createUpgrade(3, currency2, new ConstantCost(1e75));
        Unlock3.getDescription = (amount) => Localization.getUpgradeUnlockDesc("\\rho_3");
        Unlock3.getInfo = (amount) => Localization.getUpgradeUnlockInfo("\\rho_3");
        Unlock3.maxLevel = 1;
        Unlock3.isAvailable = false;
    }
    
    ///////////////////
    // Regular Upgrades
    
    // Lemma 1 //
    
    // x1
    {
        let getDesc = (level) => "x_1=" + getX1(level).toString(0);
        x1 = theory.createUpgrade(10, currency1, new FirstFreeCost(new ExponentialCost(5, Math.log2(1.2))));
        x1.getDescription = (amount) => Utils.getMath(getDesc(x1.level));
        x1.getInfo = (amount) => Utils.getMathTo(getDesc(x1.level), getDesc(x1.level + amount));
        x1.isAvailable = false;
    }
    
    // y1
    {
        let getDesc = (level) => "y_1=" + getY1(level).toString(0);
        y1 = theory.createUpgrade(11, currency1, new ExponentialCost(100, Math.log2(1.8)));
        y1.getDescription = (amount) => Utils.getMath(getDesc(y1.level));
        y1.getInfo = (amount) => Utils.getMathTo(getDesc(y1.level), getDesc(y1.level + amount));
        y1.isAvailable = false;
    }
    
    // z1
    {
        let getDesc = (level) => "z_1=" + getZ1(level).toString(0);
        z1 = theory.createUpgrade(12, currency1, new ExponentialCost(800, Math.log2(2.2)));
        z1.getDescription = (amount) => Utils.getMath(getDesc(y1.level));
        z1.getInfo = (amount) => Utils.getMathTo(getDesc(y1.level), getDesc(y1.level + amount));
        z1.isAvailable = false;
    }
    

}

var updateAvailability = () => {
    Unlock1.isAvailable = Lemma.level == 0 && Unlock1.level < 1;
    Unlock2.isAvailable = Lemma.level == 0 && Unlock1.level > 0 && Unlock2.level < 1;
    Unlock3.isAvailable = Lemma.level == 0 && Unlock2.level > 0 && Unlock3.level < 1;
    
    x1.isAvailable = Lemma.level == 1;
    y1.isAvailable = Lemma.level == 1;
    z1.isAvailable = Lemma.level == 1;
}

var isCurrencyVisible = (index) => Lemma.level == 0 && index == null || Lemma.level == 1 && index == 0 || Lemma.level == 2 && index == 1 || Lemma.level == 3 && index == 2; 

var getPrimaryEquation = () => {
    
    // Main
    if (Lemma.level == 0) {
        theory.primaryEquationScale = 1.5;
        theory.primaryEquationHeight = 40;
        
        let result = theory.latexSymbol + "=";
        if (Unlock1.level == 0) {
            result += "0";
            return result;
        } else {
            result += "\\max \\rho_{1}^{0.3} ";
            if (Unlock2.level > 0) result += "\\rho_{2}^{0.5}";
            if (Unlock3.level > 0) result += "\\rho_{3}^{0.7}";
            return result;
        }
    }
    
    // Lemma 1
    if (lemma.level == 1) {
        theory.primaryEquationScale = 0.75;
        theory.primaryEquationHeight = 80;
        
        let result = "\\int_{L[p \\rightarrow q] \\subset \\mathbb{R}^{n\\varphi}}^{}  \\nabla \\varphi \\times dr = \\varphi(q) - \\varphi(p) \\";
        result += " \\dot{\\rho_{1}} = ( x_1 y_1 z_1 ) \\times \\nabla C^{n}";
        return result;
    }
}
