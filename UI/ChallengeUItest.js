import { Popup } from "../api/ui/Popup";
import { Color } from "../api/ui/properties/Color";
import { ImageSource } from "../api/ui/properties/ImageSource";
import { Thickness } from "../api/ui/properties/Thickness";
import { ui } from "../api/ui/UI"

var id = "customUI";
var name = "Custom UI";
var description = "A custom theory to demonstrate UI capabilities.";
var authors = "sky";
var version = 1;

var popup = ui.createPopup({
    title: "Challenge Theory",
    heightRequest: ui.screenHeight,
    content: ui.createStackLayout({
        children: [
            ui.createFrame({
                    heightRequest: 150,
                    cornerRadius: 10,
                    content: ui.createLatexLabel({
                        text: "\\( \\tau_{99} = \\prod_i \\lambda_i \\)",
                        horizontalOptions: LayoutOptions.CENTER,
                        verticalOptions: LayoutOptions.CENTER
                    })
            }),
            ui.createFrame({
                heightRequest: ui.screenHeight - 160,
                cornerRadius: 6,
                content : ui.createGrid({
                    rowDefinitions: ["auto", "auto", "auto", "auto", "auto"],
                    children: [
                        ui.createButton({text: "λ1", row: 0, column: 0}),
                        ui.createButton({text: "λ2", row: 1, column: 0}),
                        ui.createButton({text: "λ3", row: 2, column: 0}),
                        ui.createButton({text: "λ4", row: 3, column: 0}),
                        ui.createButton({text: "λ5", row: 4, column: 0})
                    ]
                })
            })
        ]
    })
});
popup.show();
