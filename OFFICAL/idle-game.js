import { ExponentialCost, FirstFreeCost, LinearCost } from "../api/Costs";
import { Localization } from "../api/Localization";
import { parseBigNumber, BigNumber } from "../api/BigNumber";
import { theory } from "../api/Theory";
import { Utils } from "../api/Utils";
import { Popup } from "../api/ui/Popup";
import { Color } from "../api/ui/properties/Color";
import { ImageSource } from "../api/ui/properties/ImageSource";
import { Thickness } from "../api/ui/properties/Thickness";
import { ui } from "../api/ui/UI"

var id = "idle-game";
var name = "Idle Game";
var description = "yes it is a idle game. trust me";
var authors = "skyhigh173";
var version = 1;

var currency;
var Pub, BuyAll, Auto;
var a1, a2, a3, a4, a5;
var b1, b2, b3, b4;
var BuyBT;
var UnK, K;

var Ch1, Ch2, Ch3;

var PubTimes = 0;
var WNPUP;
var init = () => {
    currency = theory.createCurrency();

    ///////////////////
    // Regular Upgrades
    
    //a1 
    {
        let getDesc = (level) => "a_1=" + (a1.level);
        a1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(1, Math.log2(2))));
        a1.getDescription = (_) => Utils.getMath(getDesc(a1.level));
        a1.getInfo = (amount) => "+ " + getPubPerSecMulti(1) + " /sec";
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
        a3 = theory.createUpgrade(2, currency, new ExponentialCost(8000, Math.log2(3)));
        a3.getDescription = (_) => Utils.getMath(getDesc(a3.level));
        a3.getInfo = (amount) => "+ " + getPubPerSecMulti(80) + " /sec";
        a3.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); };
        a3.isAvailable = false;
    }
    //a4
    {
        let getDesc = (level) => "a_4=" + (560 * a4.level);
        a4 = theory.createUpgrade(3, currency, new ExponentialCost(30000, Math.log2(4.5)));
        a4.getDescription = (_) => Utils.getMath(getDesc(a4.level));
        a4.getInfo = (amount) => "+ " + getPubPerSecMulti(560) + " /sec";
        a4.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); };
        a4.isAvailable = false;
    }
    //a5
    {
        let getDesc = (level) => "a_5=" + (10000 * a5.level);
        a5 = theory.createUpgrade(4, currency, new ExponentialCost(700000, Math.log2(6)));
        a5.getDescription = (_) => Utils.getMath(getDesc(a5.level));
        a5.getInfo = (amount) => "+ " + getPubPerSecMulti(10000) + " /sec";
        a5.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); };
        a5.isAvailable = false;
    }
    //k
    {
        let getDesc = (level) => "K=" + (K.level / 10 + 1);
        K = theory.createUpgrade(10, currency, new ExponentialCost(200000, Math.log2(2)));
        K.getDescription = (_) => Utils.getMath(getDesc(K.level));
        K.getInfo = (amount) => "Increase rho speed";
        K.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); };
        K.isAvailable = false;
    }
    
    /////////////////////
    // Permanent Upgrades
    
    {
        WNPUP = theory.createPermanentUpgrade(0, currency, new FreeCost());
        WNPUP.getDescription = (amount) => "Whats new";
        WNPUP.getInfo = (amount) => "Open Whats new panel";
        WNPUP.bought = (amount) => {
            WhatsNewPUP.show();
        }
    }
    
    Pub = theory.createPublicationUpgrade(1, currency, 100);
    Pub.isAvailable = false;
    BuyAll = theory.createBuyAllUpgrade(2, currency, 100000);
    BuyAll.isAvailable = false;
    Auto = theory.createAutoBuyerUpgrade(3, currency, 1e6);
    Auto.isAvailable = false;
    
    {
        UnK = theory.createPermanentUpgrade(10, currency, new ExponentialCost(1000000, Math.log2(3)));
        UnK.maxLevel = 1;
        UnK.getDescription = (amount) => Localization.getUpgradeUnlockDesc("K");
        UnK.getInfo = (amount) => Localization.getUpgradeUnlockInfo("K");
        
    }
    {
        BuyBT = theory.createPermanentUpgrade(11, currency, new ExponentialCost(2000000, Math.log2(3)));
        BuyBT.maxLevel = 2;
        BuyBT.getDescription = (amount) => {
            if (BuyBT.level == 0) return Localization.getUpgradeUnlockDesc("b_1");
            if (BuyBT.level == 1) return Localization.getUpgradeUnlockDesc("b_2");
        }
        BuyBT.getInfo = (amount) => {
            if (BuyBT.level == 0) return Localization.getUpgradeUnlockInfo("b_1");
            if (BuyBT.level == 1) return Localization.getUpgradeUnlockInfo("b_2");
        }
        BuyBT.isAvailable = false;
    }
    //useless
    theory.setMilestoneCost(new LinearCost(0, 10));
    
    ///////////////////
    //// Story chapters (TBC)
    //Ch1 = theory.createStoryChapter(0, "The beginning", "You are getting board. \nYou write a program for you.\nIt is a idle game.", () => a1.level > 0);
    //Ch2 = theory.createStoryChapter(1, "Publication", "The game are getting slow. \nYou publish like before... \n", () => PubTimes > 0);

    
    updateAvailability();
}

var updateAvailability = () => {
    Pub.isAvailable = (a1.level > 5);
    BuyAll.isAvailable = a2.level > 6;
    Auto.isAvailable = a3.level > 5;
    BuyBT.isAvailable = a4.level >= 5;
    K.isAvailable = UnK.level > 0;
    
    a3.isAvailable = a2.level >= 4;
    a4.isAvailable = a3.level >= 5;
    a5.isAvailable = a4.level >= 4;
    
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    
    let TotalA = getA1(a1.level) + getA2(a2.level) + getA3(a3.level) + getA4(a4.level);
    currency.value += bonus * dt * TotalA * ((K.level) / 10 + 1);
    updateAvailability();
    theory.invalidatePrimaryEquation();
    theory.invalidateSecondaryEquation();
}

var getPrimaryEquation = () => {
    let result = "\\dot{\\rho} = \\sum_{i=1}^{} a_i";
    if (UnK.level > 0) result += " \\times K";
    return result;
}


var getSecondaryEquation = () => {
    let result = theory.latexSymbol + "=\\max\\rho";
    result += "\\qquad P =";
    result += PubTimes;
    return result;
}


var postPublish = () => {
    PubTimes += 1;
    updateAvailability();
}
var getPublicationMultiplier = (tau) => (tau.pow(0.314) / BigNumber.TWO) * (1 + (PubTimes / 10));
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.314}}{2} \\times ( 1 + \\frac{P}{10} )";
var getTau = () => currency.value;
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

function getPubPerSecMulti (plus) {
    return BigNumber.from(plus);
}
function getBUnlockInfo (level) {
    //these code is to see if level is 1, or 2, or somethin
    return 600000;
}
    

var getA1 = (level) => BigNumber.from(level);
var getA2 = (level) => BigNumber.from(level * 10);
var getA3 = (level) => BigNumber.from(level * 80);
var getA4 = (level) => BigNumber.from(level * 560);

init();


//////////////////////////////////////////////////
var WhatsNewPUP = ui.createPopup({
    title: "Whats new",
    content: ui.createStackLayout({
        children: [
            ui.createLabel({text: "-current nothing\nTYFP!"}),
            ui.createButton({text: "Close", onClicked: () => WhatsNewPUP.hide()})
            ]
    })
});
