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

var id = "why";
var name = "UI-Simulator";
var description = "An implementation of the 'all UIs' theory from the game.";
var authors = "Gilles-Philippe Paillé, sky";
var version = 1;

var currency;
var prestige, reward, theory, publication;
var psPUP, rwPUP, tePUP, pbPUP;


var init = () => {
    currency = theory.createCurrency();
    currency.value = BigNumber.from(69420);
    
    // prestige
    {
        prestige = theory.createUpgrade(0, currency, new FreeCost());
        prestige.getDescription = (_) => "Open prestige Menu";
        prestige.getInfo = (amount) => "Open prestige Menu";
        prestige.boughtOrRefunded = (_) => {
            psPUP.show();
            prestige.level = 0;
        }
    }

}

var tick = (elapsedTime, multiplier) => {
    return;
}

var getPrimaryEquation = () => {
    return "\\rho = 69420";
}

var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();


psPUP = ui.createPopup({
    title: "My Popup",
    content: ui.createStackLayout({
        children: [
