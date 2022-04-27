import { ExponentialCost, FirstFreeCost } from "../api/Costs";
import { Localization } from "../api/Localization";
import { BigNumber } from "../api/BigNumber";
import { theory } from "../api/Theory";
import { Utils } from "../api/Utils";

var id = "RFE"
var name = "Rabinovich–Fabrikant Equations";
var description = "ig looks like chaos theory";
var authors = "Gilles-Philippe Paillé";
var version = "Alpha edition v1.0.0";

var state, center, scale;
var alpha = 0.98, gamma = 0.1;
var a1;


var systems = (v) => new Vector3(v.y * (v.z - 1 + Math.pow(v.x, 2)) + gamma * v.x, v.x * (3 * v.z + 1 - Math.pow(v.x, 2)) + gamma * v.y, -2 * v.z * (alpha + v.x * v.y));

