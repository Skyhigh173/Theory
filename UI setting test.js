import { Popup } from "../api/ui/Popup";
import { Color } from "../api/ui/properties/Color";
import { ImageSource } from "../api/ui/properties/ImageSource";
import { Thickness } from "../api/ui/properties/Thickness";
import { ui } from "../api/ui/UI"

import { ExponentialCost, FirstFreeCost, LinearCost } from "../api/Costs";
import { Localization } from "../api/Localization";
import { parseBigNumber, BigNumber } from "../api/BigNumber";
import { theory } from "../api/Theory";
import { Utils } from "../api/Utils";

var id = "custom_ui_id";
var name = "Custom UI";
var description = "A custom theory to demonstrate UI capabilities.";
var authors = "Gilles-Philippe Paillé";
var version = 1;

var settings;

var currency;
var STP;
var PGB = 1, prgbar;

var ac1;
var cp1;

var init = () => {
    currency = theory.createCurrency();
        
  {
      settings = theory.createPermanentUpgrade(0, currency, new FreeCost());
      settings.getDescription = (amount) => "setting";
      settings.getInfo = (amount) => "Open Whats setting";
      settings.bought = (amount) => {
          STP.show();
      }
  }
    ac1 = theory.createAchievement(0, "Achievement 1", "Description 1", () => currency.value > 1);
    cp1 = theory.createStoryChapter(0, "My First Chapter", "This is line 1,\nand this is line 2.\n\nNice.", () => currency.value > 10);
}

var getPrimaryEquation = () => {
    return "t_1 e_2 s_3 t_4";
}
var tick = (elapsedTime, multiplier) => {
    currency.value += 1;
}
var getPublicationMultiplier = (tau) => tau.pow(0.164) / BigNumber.THREE;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.164}}{3}";
var getTau = () => currency.value;
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getEquationOverlay = () => ui.createGrid({
    margin: new Thickness(40, 0, 40, 0),
    children: [
        if (PGB == 1) {
            prgbar = ui.createProgressBar({ progress: (Math.random()), verticalOptions: LayoutOptions.START })
        }
    ]
)};
function PRGSHOWHIDE () {
    PGB = 1 - PGB;
    return null;
}
var updateAvailability = () => {
    
}
var STP = ui.createPopup({
    title: "settings",
    content: ui.createStackLayout({
        children: [
            ui.createLabel({text: "Main Settings"}),
            ui.createButton({text: "show/hide progressbar", onClicked: () => PRGSHOWHIDE()}),
            ui.createLabel({text: "theory things"}),
            ui.createButton({text: "View ach", onClicked: () => showCustomTheoryAchievements()}),
            ui.createButton({text: "View chp", onClicked: () => showCustomTheoryStory()}),
            ui.createButton({text: "Close", onClicked: () => STP.hide()}),
            ]
    })
});


init();
