import { ExponentialCost, FirstFreeCost } from "../api/Costs";
import { Localization } from "../api/Localization";
import { parseBigNumber, BigNumber } from "../api/BigNumber";
import { theory } from "../api/Theory";
import { Utils } from "../api/Utils";

var id = "Ordinal_incremental"
var name = "Ordinal Incremental";
var description = "Increase your ordinal";
var authors = "skyhigh173";
var version = 1;

// Ordinal
var Ord = ["0"];

var OrdInit = () => {
  // 1 to 10
  for (let i = 1; i < 11; i++) {
    Ord.push(i.toString());
  }
}
OrdInit();
