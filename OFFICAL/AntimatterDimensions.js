import { ExponentialCost, FirstFreeCost, LinearCost } from "../api/Costs";
import { Localization } from "../api/Localization";
import { parseBigNumber, BigNumber } from "../api/BigNumber";
import { theory } from "../api/Theory";
import { Utils } from "../api/Utils";

var id = "AD";
var name = "Antimatter Dimensions";
var description = "ad. ";
var authors = "=)";
var version = 1;

var Lemma;

// currency
var Antimatter;

// prestige
var DB, AG;

// Pre-Infinity
var tickspeed;                                // |     tickspeed      |
var d1, d2, d3, d4, d5, d6, d7, d8;           // |  bought dimension  |
var dd1, dd2, dd3, dd4, dd5, dd6, dd7, dd8;   // |   auto  dimension  |
var md1, md2, md3, md4, md5, md6, md7, md8;   // |   mult  dimension  |

// challenge
var C1, C2, C3, C4, C5, C6, C7, C8;           // |   normal challenge   |
var IC1, IC2, IC3, IC4, IC5, IC6, IC7, IC8;   // |  infinity challenge  |

C1 = C2 = C3 = C4 = C5 = C6 = C7 = C8 = false;
IC1 = IC2 = IC3 = IC4 = IC5 = IC6 = IC7 = IC8 = false;

// news!
var news = [
    "The cookie is a lie.",
    "No, mom, I can't pause this game.",
    "Do you know? Matter is a lie!",
    "I have a 9th, i have a dimension...",
    "Why not?!",
    "Uhh, this news is loooong i guess, bc it is tooooooo long and you cant see it anyway"
    
    
]


var init = () => {
    Antimatter = theory.createCurrency();
    
    {
        Lemma = theory.createUpgrade(0, currency, new FreeCost());
        Lemma.description = Localization.getUpgradeProveLemma(1);
        Lemma.info = Localization.getUpgradeProveLemma(1);
        Lemma.boughtOrRefunded = (_) => theory.clearGraph();
        Lemma.isAvailable = false; // always unavailable
    }
    
    ///////////////////
    // Regular Upgrades
    
    // Dimensions & tickspeed
