import { ExponentialCost, FirstFreeCost, LinearCost } from "../api/Costs";
import { Localization } from "../api/Localization";
import { parseBigNumber, BigNumber } from "../api/BigNumber";
import { theory } from "../api/Theory";
import { Utils } from "../api/Utils";

var id = "LeibnizLimit";
var name = "Leibniz Theory";
var description = "A theory thats limit to pi.";
var authors = "Skyhigh173";
var version = 1;

var k, q1, q2;



/*
function Limit (k) {
  let result = 0;
  for (let i = 0; i < k; i++) {
    result += Pi(i);
  }
  return result;
}

function Pi (n) {
  let upper = 2 * ((-1) ** (n)) * ((3) ** (1 / 2 - n));
  let lower = 2 * n + 1;
  return upper / lower;
}

console.log(Limit(100000));
*/
