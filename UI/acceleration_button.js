import { Popup } from "../api/ui/Popup";
import { Color } from "../api/ui/properties/Color";
import { ImageSource } from "../api/ui/properties/ImageSource";
import { Thickness } from "../api/ui/properties/Thickness";
import { ui } from "../api/ui/UI"

var id = "AB";
var name = "UI : Acceleration Button";
var description = "A custom theory to demonstrate UI capabilities.";
var authors = "Skyhigh173#3120";
var version = "v1";

var value, currency;
var accPress = false;
var TickPress;

var init = () => {
    currency = theory.createCurrency();
}

var getEquationOverlay = () => {
    let stack = ui.createStackLayout({
        children: [
           ui.createImage({
               source: ImageSource.ACCELERATE,
               verticalOptions: LayoutOptions.END,
               onClicked: accPress = true,
               onReleased: accPress = false
           })
        ]
    })
    return stack;
}
