import { ExponentialCost, FirstFreeCost } from "../api/Costs";
import { Localization } from "../api/Localization";
import { parseBigNumber, BigNumber } from "../api/BigNumber";
import { theory } from "../api/Theory";
import { Utils } from "../api/Utils";
import { Popup } from "../api/ui/Popup";
import { Color } from "../api/ui/properties/Color";
import { ImageSource } from "../api/ui/properties/ImageSource";
import { Thickness } from "../api/ui/properties/Thickness";
import { ui } from "../api/ui/UI"

var id = "ouo";
var name = "Prestige Theory";
var description = "yee";
var authors = "Skyhigh173";
var version = 1;

var currency1, currency2, currency3;

var passed1e10 = false, passed1e80 = false;
var a1, a2, k;
var j;

var shift, boost;
var shiftpup, shiftpupinfo;

var ShiftBase = BigNumber.TWO;

var init = () => {
    currency1 = theory.createCurrency();
    currency2 = theory.createCurrency();
    currency3 = theory.createCurrency();
    
    // a1
    {
        let getDesc = (level) => "a_1=" + getA1(level).toString(0);
        a1 = theory.createUpgrade(0, currency1, new FirstFreeCost(new ExponentialCost(5, Math.log2(1.85))));
        a1.getDescription = (_) => Utils.getMath(getDesc(a1.level));
        a1.getInfo = (amount) => Utils.getMathTo(getDesc(a1.level), getDesc(a1.level + amount));
    }

    // a2
    {
        let getDesc = (level) => "a_2=2^{" + level + "}";
        let getInfo = (level) => "a_2=" + getA2(level).toString(0);
        a2 = theory.createUpgrade(1, currency1, new ExponentialCost(50, Math.log2(2.4)));
        a2.getDescription = (_) => Utils.getMath(getDesc(a2.level));
        a2.getInfo = (amount) => Utils.getMathTo(getInfo(a2.level), getInfo(a2.level + amount));
    }
    
    
    theory.createBuyAllUpgrade(0, currency, 1e30);
    theory.createAutoBuyerUpgrade(1, currency, 1e250);
    
    {
        shift = theory.createPermanentUpgrade(10, currency1, new FreeCost());
        shift.getDescription = (amount) => "Currency shift";
        shift.getInfo = (amount) => "Prestige Layer 1";
        shift.bought = (amount) => {
            shift.level = 0;
            shiftpup.show();
        }
    }
}
var tick = (elapsedTime, multiplier) => {
}

var getPrimaryEquation = () => {
    let result = "\\rho_{1} = idk";
 
    return result;
}

var getPublicationMultiplier = (tau) => tau.pow(0.164) / BigNumber.THREE;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.164}}{3}";
var getTau = () => currency1.value;
var get2DGraphValue = () => currency1.value.sign * (BigNumber.ONE + currency1.value.abs()).log10().toNumber();

function getShiftCurrency (rho) {
    let cr = BigNumber.from(rho);
    return ShiftBase.pow(cr.log10() / BigNumber.from(1000).log10() - BigNumber.TEN / BigNumber.THREE);
}
function getShiftText () {
    return "\\dot{\\rho}_2 = " + getShiftCurrency(currency1);
}


/////////////////////////////////////////////////////////////
var shiftpup = ui.createPopup({
    title: "Currency Shift",
    content: ui.createStackLayout({
        children: [
            ui.createLabel({text: "You will get : "}),
            ui.createLatexLabel({
                text: getShiftText(),
                horizontalOptions: LayoutOptions.CENTER,
                verticalOptions: LayoutOptions.CENTER
            }),
            ui.createButton({text: "Do Currency Shift", horizontalOptions: LayoutOptions.START}),
            ui.createButton({
                text : "Info",
                onClicked: () => shiftpupinfo.show()
            })
        ]
    })
});

var shiftpupinfo = ui.createPopup({
    title: "Currency Shift Info",
    content: ui.createStackLayout({
        children: [
            ui.createFrame({
                heightRequest: 100,
                cornerRadius: 10,
                content: ui.createLabel({
                    text: "Currency shift is a prestige layer. \n If you do a shift, you will reset your progress, \n but give a currency (rho2).",
                    horizontalOptions: LayoutOptions.CENTER,
                    verticalOptions: LayoutOptions.CENTER
                })
            })
        ]
    })
});
