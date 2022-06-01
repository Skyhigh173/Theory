import { Popup } from "../api/ui/Popup";
import { Color } from "../api/ui/properties/Color";
import { ImageSource } from "../api/ui/properties/ImageSource";
import { Thickness } from "../api/ui/properties/Thickness";
import { ui } from "../api/ui/UI"

var id = "trigPenal";
var name = "Panel";
var description = "A custom theory to demonstrate UI capabilities.";
var authors = "sky \n XLII";
var version = 1;
var test = () => {
    
}
var popup = ui.createPopup({
    title: "DEV control Panel",
    heightRequest: 400,
    content: ui.createStackLayout({
        children: [
            ui.createButton({text: "increase $e5 \\rho$", onClicked: () => test()}),
            ui.createButton({text: "decrease $e5 \\rho$", onClicked: () => test()}),
            ui.createButton({text: "skip 1hr", onClicked: () => test()}),
            ui.createButton({text: "Close", horizontalOptions: LayoutOptions.END, onClicked: () => popup.hide()})
        ]
    })
});
popup.show();
