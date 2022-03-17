import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "MAIN";
var name = "exponential idle";
var description = "Your first theory";
var authors = "Gilles-Philippe Paillé \n Recreate:Skyhigh173";
var version = "v1.0.0";

var ft;
var c1, c2;
var c1Exp, c2Exp;
