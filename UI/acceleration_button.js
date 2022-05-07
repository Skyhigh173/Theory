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
                horizontalOptions: LayoutOptions.START,
                heightRequest: 42, // universe number : 42
                onTouched: (e) => {
                    if(e.type == TouchType.PRESSED) accPress = true;
                    else if(e.type.isReleased()) accPress = false;
                }
            }),
            ui.createLabel({text: () => Math.round(value * 100) / 100 + "x"})
        ]
    })
    return stack;
}
var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    if (accPress) TickPress += dt;
    if (!accPress) TickPress /= 2;
    if (TickPress <= 1) TickPress = 0;
    value = 1;
    //if (accPress)
    value *= Math.pow((9 * TickPress + 1), 1 / 9);
    //else
    //    value /= Math.pow(100/TickPress, 3);
    
    currency.value += value;
    theory.invalidatePrimaryEquation();
}
var getPrimaryEquation = () => {
    return "\\dot{\\rho} = " + Math.round(value * 100) / 100;
}
init();
