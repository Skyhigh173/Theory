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
    ui.createGrid({
                columnDefinitions: ["40*", "auto"],
                children: [
                    ui.createButton({text: "Challenge1", row: 0, column: 0, onClicked: () => Empty()}),
                    ui.createButton({text: "Challenge2", row: 0, column: 1, onClicked: () => Empty()}),
                ]
            })
}


function Empty () {
    
}
