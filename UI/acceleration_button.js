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

var value = 1, currency;
var accPress = false;
var TickPress = 0;

var init = () => {
    currency = theory.createCurrency();
}

var getEquationOverlay = () => {
    let stack = ui.createStackLayout({
        children: [
            ui.createImage({
                source: ImageSource.ACCELERATE,
                verticalOptions: LayoutOptions.END,
                onClicked: {accPress = true},
                onReleased: {accPress = false}
            }),
            ui.createLabel({text: value + "x"})
        ]
    })
    return stack;
}
var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    if (accPress) TickPress += 1;
    if (!accPress) TickPress = 0;
    value = 1;
    value *= Math.pow((9 * TickPress + 1), 1 / 9);
    currency.value += value;
}
var getPrimaryEquation = () => {
    return value;
}
init();
