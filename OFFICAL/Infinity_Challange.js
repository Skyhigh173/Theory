import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";
import { Popup } from "../api/ui/Popup";
import { Color } from "../api/ui/properties/Color";
import { ImageSource } from "../api/ui/properties/ImageSource";
import { Thickness } from "../api/ui/properties/Thickness";
import { ui } from "../api/ui/UI"


var id = "UITest";
var name = "infinity";
var description = "A basic theory.";
var authors = "sky =(";
var version = 1;

var getUpgradeListDelegate = () => {
    grid = ui.createGrid({
                columnDefinitions: ["1*", "50"],
                children: [
                    ui.createButton({text: "Challenge1", row: 0, column: 0, onClicked: () => Empty()}),
                    ui.createButton({text: "Challenge2", row: 0, column: 1, onClicked: () => Empty()}),
                    ui.createButton({text: "Challenge3", row: 1, column: 0, onClicked: () => Empty()}),
                    ui.createButton({text: "Challenge4", row: 1, column: 1, onClicked: () => Empty()}),
                    ui.createButton({text: "Challenge5", row: 2, column: 0, onClicked: () => Empty()}),
                    ui.createButton({text: "Challenge6", row: 2, column: 1, onClicked: () => Empty()}),
                    ui.createButton({text: "Challenge7", row: 3, column: 0, onClicked: () => Empty()}),
                    ui.createButton({text: "Challenge8", row: 3, column: 1, onClicked: () => Empty()})
                ]
            })
    return grid;
}


function Empty () {
    
}
