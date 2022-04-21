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

quaternaryEntries = [];

var id = "idle-game";
var name = "Idle Game";
var description = "A idle game that will unlocks a lots of thing during mid-game.";
var authors = "skyhigh173";
var version = "Alpha Test v0.2.0";

var currency;
var Pub, BuyAll, Auto;
var a1, a2, a3, a4, a5;
var b1, b2;
var starU, star;
var BuyBT, UnlockXi, UnlockQ, UnlockN;
var UnK, K;
var Lemma;
var xi = BigNumber.ONE, xi1 = BigNumber.ONE, xi2 = BigNumber.ONE, xi3 = BigNumber.ONE, xi4 = BigNumber.ONE;
var n1 = BigNumber.ZERO, n2 = BigNumber.ONE, dn1, dn2;

var k1, k2, k3;

var Enter1;
var BackXi, BuyXi2;

var Ch1, Ch2, Ch3;
/////////////////
var MainPage = 0;
var XiPage = 1;
var ThetaPage = 2;
var DerivativePage = 3;
var TPage = 4;
var Rho2Page = 5;

var XiPageFull = 0;
/////////////////

var PubTimes = 0;
var WNPUP;
var init = () => {
    currency = theory.createCurrency();

    ///////////////////
    //Lemma thing
    {
        Lemma = theory.createUpgrade(69420, currency, new FreeCost());
        Lemma.description = Localization.getUpgradeProveLemma(2);
        Lemma.info = Localization.getUpgradeProveLemma(2);
        Lemma.boughtOrRefunded = (_) => theory.clearGraph();
        Lemma.isAvailable = false; // always unavailable
    }
    
    //Unlock & enter xi page
    
    {
        Enter1.isAutoBuyable = (_) => false;
        Enter1 = theory.createUpgrade(69421, currency, new FreeCost());
        Enter1.getDescription = (amount) => "Enter $\\xi_1$";
        Enter1.getInfo = (amount) => "Open $\\xi_1$";
        Enter1.boughtOrRefunded = (_) => {
            lemmaChanged();
            XiPageFull = 1;
            Enter1.level = 0;
        }
    }
    
    {
        BackXi = theory.createPermanentUpgrade(69430, currency, new FreeCost());
        BackXi.getDescription = (amount) => "Back";
        BackXi.getInfo = (amount) => "Back";
        BackXi.boughtOrRefunded = (_) => {
            lemmaChanged();
            XiPageFull = 0;
            BackXi.level = 0;
        }
    }
    
    
    
    // Regular Upgrades
    
    //a1 
    {
        let getDesc = (level) => "a_1=" + (a1.level);
        a1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(1, Math.log2(1.6))));
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
        let getDesc = (level) => "a_5=" + (6000 * a5.level);
        a5 = theory.createUpgrade(4, currency, new ExponentialCost(700000, Math.log2(6)));
        a5.getDescription = (_) => Utils.getMath(getDesc(a5.level));
        a5.getInfo = (amount) => "+ " + getPubPerSecMulti(6000) + " /sec";
        a5.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); };
        a5.isAvailable = false;
    }
    //k
    {
        let getDesc = (level) => {
            if (BuyBT.level > 0) {
                return "K=" + (K.level / 10 + 1) + "\\times ( 1 + b_1 )";
            } else {
                return "K=" + getK(K.level);
            }
        }
        K = theory.createUpgrade(10, currency, new ExponentialCost(200000, Math.log2(2)));
        K.getDescription = (_) => Utils.getMath(getDesc(K.level));
        K.getInfo = (amount) => "Increase rho speed";
        K.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); };
        K.isAvailable = false;
    }
    
    //b1
    {
        let getDesc = (level) => {
            if (BuyBT.level > 1) {
                return "b_1=" + getB1(b1.level) + "\\times ( 1 + b_2 )";
            } else {
                return "b_1=" + getB1(b1.level);
            }
        }
        b1 = theory.createUpgrade(11, currency, new ExponentialCost(1e6, Math.log2(5)));
        b1.getDescription = (_) => Utils.getMath(getDesc(b1.level));
        b1.getInfo = (amount) => "Increase rho speed";
        b1.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); };
        b1.isAvailable = false;
    }
    //b2
    {
        let getDesc = (level) => "b_2=" + getB2(b2.level);
        b2 = theory.createUpgrade(12, currency, new ExponentialCost(1e7, Math.log2(6.2)));
        b2.getDescription = (_) => Utils.getMath(getDesc(b2.level));
        b2.getInfo = (amount) => "Increase rho speed";
        b2.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); };
        b2.isAvailable = false;
    }
    //n1
    {
        let getDesc = (level) => {
            if (UnlockN.level == 1) return "\\dot{n}_1=" + getDN1(dn1.level);
            if (UnlockN.level == 2) return "\\dot{n}_1=" + getDN1(dn1.level) + " \\times n_2";
        }
        dn1 = theory.createUpgrade(13, currency, new ExponentialCost(1e8, Math.log2(4.5)));
        dn1.getDescription = (_) => Utils.getMath(getDesc(dn1.level));
        dn1.getInfo = (amount) => "Increase n1";
        dn1.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); };
        dn1.isAvailable = false;
    }
    //n2
    {
        let getDesc = (level) => "\\dot{n}_2=" + getDN2(dn2.level);
        dn2 = theory.createUpgrade(14, currency, new ExponentialCost(1e28, Math.log2(4.8)));
        dn2.getDescription = (_) => Utils.getMath(getDesc(dn2.level));
        dn2.getInfo = (amount) => "Increase n2";
        dn2.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); };
        dn2.isAvailable = false;
    }
    
    ///////////X1 & X2
    
    //k1
    {
        let getDesc = (level) => "k_1=" + getK1(k1.level);
        k1 = theory.createUpgrade(50, currency, new ExponentialCost(2e10, Math.log2(4)));
        k1.getDescription = (_) => Utils.getMath(getDesc(k1.level));
        k1.getInfo = (amount) => "Increase k1";
        k1.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); };
    }
    
    //k2
    {
        let getDesc = (level) => "k_2= 1 + " + (k2.level + 0) + "\\times" + k1.level;
        k2 = theory.createUpgrade(51, currency, new ExponentialCost(5e11, Math.log2(8)));
        k2.getDescription = (_) => Utils.getMath(getDesc(k2.level));
        k2.getInfo = (amount) => "Increase k2";
        k2.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); };
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
        UnK = theory.createPermanentUpgrade(9, currency, new ExponentialCost(1000000, Math.log2(3)));
        UnK.maxLevel = 1;
        UnK.getDescription = (amount) => Localization.getUpgradeUnlockDesc("K");
        UnK.getInfo = (amount) => Localization.getUpgradeUnlockInfo("K");
        
    }

    {
        UnlockXi = theory.createPermanentUpgrade(10, currency, new ExponentialCost(1e10, Math.log2(3)));
        UnlockXi.maxLevel = 1;
        UnlockXi.getDescription = (amount) => {
            if (currency.value > 1.5e8) {
                return Localization.getUpgradeUnlockDesc("\\xi");
            } else {
                return "Unlock ???";
            }
        }
        UnlockXi.getInfo = (amount) => {
            if (currency.value > 1.5e8) {
                return Localization.getUpgradeUnlockInfo("\\xi");
            } else {
                return "Unlock a new thing";
            }
        }
        
    }

    {
        BuyBT = theory.createPermanentUpgrade(11, currency, new ExponentialCost(2000000, Math.log2(6)));
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
    
    let NCost = new CustomCost((level) =>
    {
        var cost = 1e10;

        switch(level+1)
        {
            case 1: cost = 1e8; break;
            case 2: cost = 1e30; break;
        }

        return BigNumber.from(cost);
    });
 

    
    
    {
        UnlockN = theory.createPermanentUpgrade(12, currency, NCost);
        UnlockN.maxLevel = 2;
        UnlockN.getDescription = (amount) => {
            if (UnlockN.level == 0) return Localization.getUpgradeUnlockDesc("n_1");
            if (UnlockN.level == 1) return Localization.getUpgradeUnlockDesc("n_2");
        }
        UnlockN.getInfo = (amount) => {
            if (UnlockN.level == 0) return Localization.getUpgradeUnlockInfo("n_1");
            if (UnlockN.level == 1) return Localization.getUpgradeUnlockInfo("n_2");
        }
        UnlockN.isAvailable = false;
    }

    {
        UnlockQ = theory.createPermanentUpgrade(13, currency, new ExponentialCost(5e8, Math.log2(2)));
        UnlockQ.maxLevel = 1;
        UnlockQ.getDescription = (amount) => Localization.getUpgradeUnlockDesc("q");
        UnlockQ.getInfo = (amount) => Localization.getUpgradeUnlockInfo("q");
        UnlockQ.isAvailable = false;
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
    Pub.isAvailable = Lemma.level == (MainPage) && a1.level > 5 && Pub.level == 0;
    BuyAll.isAvailable = Lemma.level == (MainPage) && a2.level > 6 && BuyAll.level == 0;
    Auto.isAvailable = Lemma.level == (MainPage) && a3.level > 5 && Auto.level == 0;

    //MainPage

    BuyBT.isAvailable = Lemma.level == (MainPage) && a4.level >= 5 && UnK.level > 0 && BuyBT.level == 0;
    UnK.isAvailable = Lemma.level == (MainPage) && a4.level >= 2 && UnK.level == 0;
    UnlockXi.isAvailable = Lemma.level == (MainPage) && UnlockXi.level == 0 && a5.level > 0;
    UnlockN.isAvailable = Lemma.level == (MainPage) && K.level >= 2 && UnlockN.level < 2;
    UnlockQ.isAvailable = Lemma.level == (MainPage) && K.level >= 4 && UnlockQ.level == 0;
    
    Enter1.isAvailable = Lemma.level == (XiPage) && XiPageFull == 0;
    BackXi.isAvailable = Lemma.level == (XiPage) && XiPageFull > 0;
    
    K.isAvailable = Lemma.level == (MainPage) && UnK.level > 0;
    a1.isAvailable = Lemma.level == (MainPage);
    a2.isAvailable = Lemma.level == (MainPage);
    a3.isAvailable = Lemma.level == (MainPage) && a2.level >= 4;
    a4.isAvailable = Lemma.level == (MainPage) && a3.level >= 5;
    a5.isAvailable = Lemma.level == (MainPage) && a4.level >= 4;
    
    b1.isAvailable = Lemma.level == (MainPage) && BuyBT.level > 0;
    b2.isAvailable = Lemma.level == (MainPage) && BuyBT.level > 1;
    dn1.isAvailable = Lemma.level == (MainPage) && UnlockN.level > 0;
    dn2.isAvailable = Lemma.level == (MainPage) && UnlockN.level > 1;
    
    k1.isAvailable = Lemma.level == (XiPage) && XiPageFull == 1;
    k2.isAvailable = Lemma.level == (XiPage) && XiPageFull == 1;
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    let n1UnK = 1;
    
    if (UnlockN.level > 1) n1UnK = n2;
    if (UnlockN.level > 0) n1 += getDN1(dn1.level) * n1UnK * dt;
    if (UnlockN.level > 1) n2 += getDN2(dn2.level) * dt;
    
    let Q = 1
    if (UnlockQ.level == 0) {
        Q = 1;
    } else {
        Q = getA1(a1.level).pow(2) - 1;
    }
    
    if (UnlockXi.level > 0) {
        xi1 += dt * BigNumber.from(getK1(k1.level) * getK2(k2.level));
        xi = BigNumber.from(xi1 * xi2 * xi3 * xi4);
    } else {
        xi = BigNumber.ZERO;
    }
    
    let TotalA = getA1(a1.level) + getA2(a2.level) + getA3(a3.level) + getA4(a4.level) + getA5(a5.level);
    currency.value += bonus * dt * ( TotalA * getK(K.level) + BigNumber.from(n1) * Q ) + xi;
    
    updateAvailability();
    theory.invalidatePrimaryEquation();
    theory.invalidateSecondaryEquation();
    theory.invalidateTertiaryEquation();
    theory.invalidateQuaternaryValues();
    
}

var getPrimaryEquation = () => {
    
    if (Lemma.level == MainPage) {
        let result = "\\dot{\\rho} = ( \\sum_{i=1}^{} a_i )";
        if (UnK.level > 0) result += " \\times K";
        if (UnlockN.level > 0) result += " + n_1";
        if (UnlockQ.level > 0) result += "q";
        if (UnlockXi.level > 0) result += "+ \\xi";
        return result;
        
    } else if (Lemma.level == XiPage) {
        if (XiPageFull == 0) return "\\xi = \\xi_1";
        if (XiPageFull == 1) return "\\xi_{1} = k_1 k_2 + k_3 q";
    }
}


var getSecondaryEquation = () => {
    if (Lemma.level == MainPage) {
        let result = theory.latexSymbol + "=\\max\\rho";
        result += "\\qquad P =";
        result += PubTimes;
        if (UnlockQ.level > 0) result += "\\qquad q = a_{1}^{2}";
        if (UnlockXi.level > 0) result += "\\qquad \\xi = \\xi_{1}";
        return result;
    }
    if (Lemma.level == XiPage) {
        if (XiPageFull == 0) return " ";
        if (XiPageFull == 1) return "q = a_{1}^{2}";
    }
}

var getTertiaryEquation = () => {
    if (Lemma.level == MainPage) {
        if (UnlockXi.level == 0) return " ";
        if (UnlockXi.level >= 1) return "\\xi =" + xi;
    } else if (Lemma.level == XiPage) {
        if (XiPageFull == 0) return " ";
        if (XiPageFull == 1) return "\\xi_1 =" + xi1;
    }
}

var postPublish = () => {
    PubTimes += 1;
    n1 = 0;
    n2 = 1;
    xi1 = BigNumber.ONE;
}




var getPublicationMultiplier = (tau) => (tau.pow(0.314) / BigNumber.TWO) * (1 + (PubTimes / 20));
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.314}}{2} \\times ( 1 + \\frac{P}{20} )";
var getTau = () => currency.value;
var get2DGraphValue = () => {
    if (Lemma.level == MainPage) return currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();
    if (Lemma.level == XiPage && XiPageFull == 0) return BigNumber.from(xi).sign * (BigNumber.ONE + BigNumber.from(xi).abs()).log10().toNumber();
    if (Lemma.level == XiPage && XiPageFull == 1) return BigNumber.from(xi1).sign * (BigNumber.ONE + BigNumber.from(xi1).abs()).log10().toNumber();
}

function getPubPerSecMulti (plus) {
    return BigNumber.from(plus);
}

    

var getA1 = (level) => BigNumber.from(level);
var getA2 = (level) => BigNumber.from(level * 10);
var getA3 = (level) => BigNumber.from(level * 80);
var getA4 = (level) => BigNumber.from(level * 560);
var getA5 = (level) => BigNumber.from(level * 6000);

var getK = (level) => {
    if (UnK.level == 0) {
        return BigNumber.ONE;
    } else if (UnK.level == 1 && BuyBT.level == 0) {
        return BigNumber.from(1 + level / 10);
    } else {
        return BigNumber.from((1 + level / 10) * getB1(b1.level));
    }
}
var getB1 = (level) => {
    if (BuyBT.level == 0) {
        return BigNumber.ONE;
    } else if (BuyBT.level == 1) {
        return Utils.getStepwisePowerSum(level, 2, 8, 1);
    } else {
        return (Utils.getStepwisePowerSum(level, 2, 8, 1) * getB2(b2.level));
    }
}
var getB2 = (level) => Utils.getStepwisePowerSum(level, 2, 4, 1);

var getDN1 = (level) => Utils.getStepwisePowerSum(level, 2, 8, 0);
var getDN2 = (level) => Utils.getStepwisePowerSum(level, 2, 6, 0);

var getK1 = (level) => Utils.getStepwisePowerSum(level, 2, 5, 0);
var getK2 = (level) => BigNumber.from(1 + level * k1.level);
////////////////
var canGoToPreviousStage = () => Lemma.level !== 0;
var goToPreviousStage = () => {
    Lemma.level -= 1;
    XiPageFull = 0;
    lemmaChanged();
}
var canGoToNextStage = () => Lemma.level == 0 && UnlockXi.level > 0;
var goToNextStage = () => {
    Lemma.level += 1;
    XiPageFull = 0;
    lemmaChanged();
} 

function lemmaChanged () {
    theory.clearGraph();
    quaternaryEntries = [];
}
    
////////////////  


//////
var getQuaternaryEntries = () => {
    if (quaternaryEntries.length == 0)
    {
        //Lemma1 : Main
        if (Lemma.level == MainPage && UnlockN.level > 0) 
        {
            quaternaryEntries.push(new QuaternaryEntry("n_1", null));
            quaternaryEntries.push(new QuaternaryEntry("n_2", null));
            quaternaryEntries.push(new QuaternaryEntry("?", null));
            quaternaryEntries.push(new QuaternaryEntry("?", null));
        }
        //Lemma2 Main : XiMain
        if (Lemma.level == XiPage && XiPageFull == 0) 
        {
            quaternaryEntries.push(new QuaternaryEntry("\\xi_1", null));
            quaternaryEntries.push(new QuaternaryEntry("\\xi_2", null));
            quaternaryEntries.push(new QuaternaryEntry("\\xi_3", null));
            quaternaryEntries.push(new QuaternaryEntry("\\xi_4", null));
        }
    }
    if (quaternaryEntries.length > 0) {
        if (Lemma.level == MainPage && UnlockN.level > 0) {
            quaternaryEntries[0].value = UnlockN.level > 0 ? n1.toString() : null;
            quaternaryEntries[1].value = UnlockN.level > 1 ? n2.toString() : null;
            quaternaryEntries[2].value = null;
            quaternaryEntries[3].value = null;
        }
        if (Lemma.level == XiPage && XiPageFull == 0) {
            quaternaryEntries[0].value = BigNumber.from(xi1).toString();
            quaternaryEntries[1].value = null;
            quaternaryEntries[2].value = null;
            quaternaryEntries[3].value = null;
        }
    }
    return quaternaryEntries;
}

//////

init();


//////////////////////////////////////////////////
var WhatsNewPUP = ui.createPopup({
    title: "Whats new in Alpha v0.2.0",
    content: ui.createStackLayout({
        children: [
            ui.createLabel({text: "-display page \n Thank you for playing!"}),
            ui.createButton({text: "Close", onClicked: () => WhatsNewPUP.hide()})
            ]
    })
});
