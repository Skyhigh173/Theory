import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "Big";
var name = "Infinite Theory";
var description = "?";
var authors = "???";
var version = "1";

var bt1;
var currency1, currency2;


var init = () => {
    currency1 = theory.createCurrency();

    ///////////////////
    // Regular Upgrades

    // bt1
    {
        let getDesc = (level) => "\\alpha =" + getBT1(level).toString(0);
        bt1 = theory.createUpgrade(0, currency1, new FirstFreeCost(new ExponentialCost(20, Math.log2(1.5))));
        bt1.getDescription = (_) => Utils.getMath(getDesc(bt1.level));
        bt1.getInfo = (amount) => Utils.getMathTo(getDesc(bt1.level), getDesc(bt1.level + amount));
        
    }
    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e10);
    theory.createBuyAllUpgrade(1, currency, 1e13);
    theory.createAutoBuyerUpgrade(2, currency, 1e30);

    
    updateAvailability();
}

var updateAvailability = () => {
    bt1.maxLevel = bt1.level + 1;
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    
    currency1.value += getBT1(bt1.level) * dt * bonus;
    currency2.value += dt * (BigNumber.TEN + currency.value).log10(); //no bonus
}

var getPublicationMultiplier = (tau) => tau.pow(1.96) / BigNumber.TEN * BigNumber.from(1 + pubM.level / 4);
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{1.96}}{10} \\times " + (1 + pubM.level / 4);
var getTau = () => currency.value.pow(0.1);
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();
init;
