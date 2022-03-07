import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "axolotl_OuO";
var name = "fission reactor";
var description = "fission reactor(and some other things)(ps:this is not nuclear craft) full equation: https://cdn.discordapp.com/attachments/926536015718543402/938365946265997342/unknown.png and others u think by urself";
var authors = "a nub ouo (nubest#1001) \n\n contributors \n\n Alex27#6175 \n 71~073~#7380";
var version = 1.14;

var currencies = new Array(9);
var currencies_names = ["U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "P"];

var Um, UD;

var reactors = new Array(7);
var reactors_puri = new Array(7);
var reactors_perm = new Array(7);

var OPHWR, OMSR,OI;
var UDExp, PHWR, MSR;

quaternaryEntries = [];

var isCurrencyVisible = (index) => index == 8;
var init = () => {
    for (let i = 0; i < currencies.length; ++i) {
        currencies[i] = theory.createCurrency(currencies_names[i], currencies_names[i]);
        currencies[i].value = BigNumber.ZERO;
    }
    let names = ["Uranium", "Neptunium", "Plutonium", "Americium", "Curium", "Berkelium", "Californium"];

    {
        let getDesc = (level) => "(\\text{U}_1)\\text{Uranium Mine level:" + level+ "}";
        let getInfo = (level) => "(\\text{U}_1)\\text{U mine level:}" +getUm(level).toString(0);
        Um = theory.createUpgrade(0, currencies[8], new FreeCost());
        Um.getDescription = (_) => Utils.getMath(getDesc(Um.level));
        Um.getInfo = (amount) => Utils.getMathTo(getInfo(Um.level), getInfo(Um.level + 1));
    }
    {
        let getDesc = (level) => "(\\text{U}_2)\\text{Uranium mine Drill level:" + level+ "}";
        let getInfo = (level) => "(\\text{U}_2)\\text{Drill power:}" +getUD(level).toString(0);
        UD = theory.createUpgrade(8, currencies[0], new FreeCost());
        UD.getDescription = (_) => Utils.getMath(getDesc(UD.level));
        UD.getInfo = (amount) => Utils.getMathTo(getInfo(UD.level), getInfo(UD.level + 1));
    }

    {
        let ReactPowr = [getUR, getNpR, getPuR, getAmR, getCmR, getBkR, getCfR];
        let up_indices = [3, 1, 1, 1, 1, 1, 1];
        let exp_consts = [[1.3, .9768], [1.7, .9772], [1.7, .9779], [1.7, .9782], [1.7, .978], [1.7, .978], [1.65, .9779]];

        for (let i = 0; i < names.length; ++i) {
            let getDesc = (level) => `(\\text{${currencies_names[i]}}_${up_indices[i]})\\text{${names[i]} Reactor level: ${level}}`;
            let getInfo = (level) => `(\\text{${currencies_names[i]}}_${up_indices[i]})\\text{Reactor power:}${(ReactPowr[i](level)).toString(0)}`;
            reactors[i] = theory.createUpgrade(i + 1, currencies[i], new FreeCost());
            reactors[i].getDescription = (_) => Utils.getMath(getDesc(reactors[i].level));
            reactors[i].getInfo = (amount) => Utils.getMathTo(getInfo(reactors[i].level), getInfo(reactors[i].level + 1));
            reactors[i].isAvailable = false;
        }
    }
    {
        let PuriPowr = [getURT, getNpRT, getPuRT, getAmRT, getCmRT, getBkRT, getCfRT];
        let up_indices = [4, 2, 2, 2, 2, 2, 2];
        let exp_consts = [[3.3, .977], [3.9, .9773], [4.9, .978], [3.9, .9779], [2.9, .9881], [3.9, .9777], [2.9, .9778]];

        for (let i = 0; i < names.length; ++i) {
            let getDesc = (level) => `(\\text{${currencies_names[i]}}_${up_indices[i]})\\text{${names[i]} fuel purifier power:}2^{${level}}`;
            let getInfo = (level) => `(\\text{${currencies_names[i]}}_${up_indices[i]})\\text{purifier power:}${(PuriPowr[i](level)).toString(0)}`;
            reactors_puri[i] = theory.createUpgrade(i + 9, currencies[i + 1], new FreeCost());
            reactors_puri[i].getDescription = (_) => Utils.getMath(getDesc(reactors_puri[i].level));
            reactors_puri[i].getInfo = (amount) => Utils.getMathTo(getInfo(reactors_puri[i].level), getInfo(reactors_puri[i].level + 1));
            reactors_puri[i].isAvailable = false;
        }
    }

    {
        let getDesc = (level) => "(\\text{R}_1)\\text{Overall Pressurized heavywater reactor level:" + level + "}";
        let getInfo = (level) => "(\\text{R}_1)\\text{OPHWR power:}" + getOPHWR(level).toString(0);
        OPHWR = theory.createUpgrade(16, currencies[7], new FreeCost());
        OPHWR.getDescription = (_) => Utils.getMath(getDesc(OPHWR.level));
        OPHWR.getInfo = (amount) => Utils.getMathTo(getInfo(OPHWR.level), getInfo(OPHWR.level + 1));
        OPHWR.isAvailable = false;
        OPHWR.maxLevel = 20;
    }
    {
        let getDesc = (level) => "(\\text{R}_2)\\text{Overall Molten salt reactor upgrade level:" + level + "}";
        let getInfo = (level) => "(\\text{R}_2)\\text{OMSR Upgrade power:}" + getOMSR(level).toString(0);
        OMSR = theory.createUpgrade(17, currencies[7], new FreeCost());
        OMSR.getDescription = (_) => Utils.getMath(getDesc(OMSR.level));
        OMSR.getInfo = (amount) => Utils.getMathTo(getInfo(OMSR.level), getInfo(OMSR.level + 1));
        OMSR.isAvailable = false;
        OMSR.maxLevel = 1000;
    }
    {
        let getDesc = (level) => "(\\text{R}_3)\\text{Overall power production level:}2^{" + level + "}";
        let getInfo = (level) => "(\\text{R}_3)\\text{R_3 power:}" + getOI(level).toString(0);
        OI = theory.createUpgrade(18, currencies[8], new FreeCost());
        OI.getDescription = (_) => Utils.getMath(getDesc(OI.level));
        OI.getInfo = (amount) => Utils.getMathTo(getInfo(OI.level), getInfo(OI.level + 1));
    }

    theory.createPublicationUpgrade(0, currencies[1], 10000);
    theory.createBuyAllUpgrade(1, currencies[5], 40);
    theory.createAutoBuyerUpgrade(2, currencies[7], 7.5);

    {
        let lin_consts = [1200000, 900000, 10000000, 80000000, 2000000, 5000000, 160000000000]
        for (let i = 0; i < 7; ++i) {
            reactors_perm[i] = theory.createPermanentUpgrade(i + 3, currencies[i], LinearCost(lin_consts[i], 0));
            reactors_perm[i].maxLevel = 1;
            reactors_perm[i].getDescription = (_) => Localization.getUpgradeUnlockDesc(`\\text{${names[i]} Reactor}`);
            reactors_perm[i].getInfo = (_) => Localization.getUpgradeUnlockInfo(`\\text{${names[i]} Reactor}`);
            reactors_perm[i].boughtOrRefunded = (_) => updateAvailability();
        }
    }

    theory.setMilestoneCost(new LinearCost(31, 10));
    {
        UDExp = theory.createMilestoneUpgrade(0, 2);
        UDExp.description = Localization.getUpgradeIncCustomExpDesc("\\text{U}_2", "0.1");
        UDExp.info = Localization.getUpgradeIncCustomExpInfo("\\text{U}_2", "0.1");
    }
    {
        PHWR=theory.createMilestoneUpgrade(1,1);
        PHWR.description = Localization.getUpgradeAddTermDesc("\\text{Pressurized heavywater reactor}");
        PHWR.info=Localization.getUpgradeAddTermInfo("\\text{Unlock Pressurized heavywater reactor}");
        PHWR.boughtOrRefunded = (_) => updateAvailability();
        PHWR.canBeRefunded = (_) => MSR.level == 0;
    }
    {
        MSR=theory.createMilestoneUpgrade(2,1);
        MSR.description = Localization.getUpgradeAddTermDesc("\\text{Molten salt reactor}");
        MSR.info=Localization.getUpgradeAddTermInfo("\\text{Unlock Molten salt reactor}");
        MSR.boughtOrRefunded = (_) => updateAvailability();
        MSR.isAvailable = false;
    }

    achievement1 = theory.createSecretAchievement(0, "Warm Green Glow", "Unlock Uranium Reactor", "Unlock Uranium Reactor", () => reactors_perm[0].level > 0);
    achievement2 = theory.createSecretAchievement(1, "Sweet Neptune", "Unlock Neptunium Reactor", "Unlock Neptunium Reactor", () => reactors_perm[1].level > 0);
    achievement3 = theory.createSecretAchievement(2, "Criticality", "Unlock Plutonium Reactor", "Unlock Plutonium Reactor", () => reactors_perm[2].level > 0);
    achievement4 = theory.createSecretAchievement(3, "In Physics We Trust", "Unlock Americium Reactor", "Unlock Americium Reactor", () => reactors_perm[3].level > 0);
    achievement5 = theory.createSecretAchievement(4, "Curious Marie", "Unlock Curium Reactor", "Unlock Curium Reactor", () => reactors_perm[4].level > 0);
    achievement6 = theory.createSecretAchievement(5, "Made in Alameda", "Unlock Berkelium Reactor", "Unlock Berkelium Reactor", () => reactors_perm[5].level > 0);
    achievement7 = theory.createSecretAchievement(6, "California Dreamin'", "Unlock Californium Reactor", "Unlock Californium Reactor", () => reactors_perm[6].level > 0);
    achievement8 = theory.createSecretAchievement(7, "E=mc²", "Einstenium amout > 1e10","no", () => currencies[7].value > BigNumber.from(1e10));
    achievement9 = theory.createSecretAchievement(8, "who on earth will do this", "buy 1 million U_1 level", "professional clicker", () => Um.level>1000000);
    achievement10 = theory.createSecretAchievement(9,"you are half way there", "ONE GIGA CLICKS", "baldy.exe", ()=>Um.level>BigNumber.from(1000000000));
    achievement11 = theory.createSecretAchievement(10,"The fifth generation","who knows when, the end of the beginning","the end...or is it?",()=> currencies[8].value > BigNumber.from(1e125));
}
var updateAvailability = () => {
    for (let i = 0; i < 7; ++i) {
        reactors[i].isAvailable = reactors_perm[i].level > 0;
        reactors_puri[i].isAvailable = reactors_perm[i].level > 0;
    }
    MSR.isAvailable = PHWR.level > 0;
    OPHWR.isAvailable = PHWR.level > 0;
    OMSR.isAvailable = MSR.level > 0;
}
var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    //decay
    {
        let constants = [
            [1.123141e-12, 2e-15], [4.1341e-10, 5.5202256e-14], [1.231e-12, 1.36298592e-13], 
            [1.266e-12, 2.83824e-12], [5.67648e-12, 4.351968e-11], [1e-11, 1.538784e-10]
        ];
        let currencies_indices = [0, 0, 2, 3, 4, 0];
        currencies[0].value += dt*bonus*(getUD(UD.level).pow(getUDExponent(UDExp.level)))*Math.log2(Um.level+1);
        for (let i = 1; i < 7; ++i) {
            currencies[i].value += currencies[currencies_indices[i-1]].value *
                BigNumber.from(constants[i-1][0]) * 30 * dt -
                currencies[i].value * 
                BigNumber.from(constants[i-1][1]) * dt * 30
        }
        currencies[7].value += currencies[6].value*BigNumber.from(8.938784e-4)*Math.log2(bonus)*dt*Math.log2(bonus)*Math.log2(bonus);
        currencies[8].value += 
            (((currencies[1].value) * dt * 1 +
            (currencies[2].value) * dt * 6.22 +
            (currencies[3].value) * dt * 31.722 +
            (currencies[4].value) * dt * 31.5 +
            (currencies[5].value) * dt * 10880 +
            (currencies[6].value) * dt * 400000)) *
            (BigNumber.from(currencies[7].value + 1).pow(1.1)
        );
    }
    //Uranium
    {
        let constants = [.55, .06, .02, .006, .005, .00003, .00001, .0000002, 2.22517e3];
        currencies[0].value += currencies[0].value < reactors[0].level ? 0 : reactors[0].level * constants[0] * dt * 30 * Math.log2(bonus) * Math.log2(bonus);

        for (let i = 1; i < 7; ++i) {
            currencies[i].value += currencies[0].value < reactors[0].level ? 0 : reactors[0].level*constants[i] * dt * 30 * (1+(OPHWR.level)) * (1+(OMSR.level)) * (Math.log2(bonus));
        }

        currencies[7].value += currencies[0].value < reactors[0].level ? 0 : reactors[0].level * constants[7] * reactors_puri[0].level * dt * 30 *
            (1+(OPHWR.level)) * (1+(OMSR.level)) * Math.log2(bonus);
        currencies[8].value += currencies[0].value < reactors[0].level ? 0 : reactors[0].level * dt * BigNumber.from(constants[8]) * reactors_puri[0].level * 
            Math.log2(bonus) * (1+(OPHWR.level)) * (1+(OMSR.level));
    }
    //neptunium
    {
        let constants = [.1, .412, .165, .014, .016, .001, .008, .001, 2.23124e5];
        currencies[1].value += currencies[1].value < reactors[1].level ? 0 : reactors[1].level * constants[1] * dt * 30 * (Math.log2(bonus)) * (Math.log2(bonus));
        
        for (let i = 0; i < 6; ++i) {
            if (i == 1) continue;
            currencies[i].value += currencies[1].value < reactors[1].level ? 0 : reactors[1].level * constants[i] * dt * 30 * (1 + (OPHWR.level)) * (1 + (OMSR.level)) * (Math.log2(bonus));
        }

        currencies[7].value += currencies[1].value < reactors[1].level ? 0 : reactors[1].level * constants[7] * reactors_puri[1].level * dt * 30 * 
            (1+(OPHWR.level)) * (1+(OMSR.level)) * Math.log2(bonus);
        currencies[8].value += currencies[1].value < reactors[1].level ? 0 : reactors[0].level * reactors[1].level * dt * BigNumber.from(constants[8]) * reactors_puri[1].level *
            Math.log2(bonus) * (1+(OPHWR.level)) * (1+(OMSR.level));
    }
    //plutonium
    {
        let constants = [.3, .22, .29, .01, .0008, .003, 2.089e6];
        currencies[2].value += currencies[2].value < reactors[2].level ? 0 : reactors[2].level * constants[0] * dt * 30 * Math.log2(bonus) * Math.log2(bonus);
        
        for (let i = 3; i < 7; ++i) {
            currencies[i].value += currencies[2].value < reactors[2].level ? 0 : reactors[2].level * constants[i - 2] * dt * 30 * (1 + OPHWR.level) * (1 + OMSR.level) * Math.log2(bonus);
        }

        currencies[7].value += currencies[2].value < reactors[2].level ? 0 : reactors[2].level * constants[5] * reactors_puri[2].level * dt * 30 *
            (1+(OPHWR.level)) * (1+(OMSR.level)) * Math.log2(bonus);
        currencies[8].value += currencies[2].value < reactors[2].level ? 0 : reactors[0].level * reactors[1].level *reactors[2].level * BigNumber.from(constants[6]) * dt *
            reactors_puri[2].level * Math.log2(bonus) * (1+(OPHWR.level)) * (1+(OMSR.level));
    }
    //americium
    {
        let constants = [.4, .26, .03, .02, .08, 4.42e7];
        currencies[3].value += currencies[3].value < reactors[3].level ? 0 : reactors[3].level * constants[0] * dt * 30 * Math.log2(bonus) * Math.log2(bonus);
        
        for (let i = 4; i < 7; ++i) {
            currencies[i].value += currencies[3].value < reactors[3].level ? 0 : reactors[3].level * constants[i-3] * dt * 30 * (1+(OPHWR.level)) * (1+(OMSR.level)) * Math.log2(bonus);
        }

        currencies[7].value += currencies[3].value < reactors[3].level ? 0 : reactors[3].level * 0.08 * reactors_puri[3].level * dt * 30 * 
            (1+(OPHWR.level)) * (1+(OMSR.level)) * Math.log2(bonus);
        currencies[8].value += currencies[3].value < reactors[3].level ? 0 : reactors[0].level * reactors[1].level * reactors[2].level * reactors[3].level * BigNumber.from(4.42e7) * dt * 
            reactors_puri[3].level * Math.log2(bonus) * (1+(OPHWR.level)) * (1+(OMSR.level));
    }
    //curium
    {
        let constants = [.34, .5, .1, .7, 2.3e8];
        currencies[4].value += currencies[4].value < reactors[4].level ? 0 : reactors[4].level * constants[0] * dt * 30 * Math.log2(bonus) * Math.log2(bonus);

        currencies[5].value += currencies[4].value < reactors[4].level ? 0 : reactors[4].level * constants[1] * dt * 30 * (1+(OPHWR.level)) * (1+(OMSR.level)) * Math.log2(bonus);
        currencies[6].value += currencies[4].value < reactors[4].level ? 0 : reactors[4].level * constants[2] * dt * 30 * (1+(OPHWR.level)) * (1+(OMSR.level)) * Math.log2(bonus);

        currencies[7].value += currencies[4].value < reactors[4].level ? 0 : reactors[4].level * constants[3] * reactors_puri[4].level * dt * 30 *
            (1+(OPHWR.level)) * (1+(OMSR.level)) * Math.log2(bonus);
        currencies[8].value += currencies[4].value < reactors[4].level ? 0 : reactors[0].level * reactors[1].level * reactors[2].level * reactors[3].level * reactors[4].level * 
            BigNumber.from(constants[4]) * dt * reactors_puri[4].level * Math.log2(bonus) * (1+(OPHWR.level)) * (1+(OMSR.level));
    }
    //berkelium
    {
        let constants = [.4, .55, .25, 2e9];
        currencies[5].value += currencies[5].value < reactors[5].level ? 0 : reactors[5].level * constants[0] * dt * 30 * Math.log2(bonus) * Math.log2(bonus);

        currencies[6].value += currencies[5].value < reactors[5].level ? 0 : reactors[5].level * constants[1] * dt * 30 * (1+(OPHWR.level)) * (1+(OMSR.level)) * Math.log2(bonus);

        currencies[7].value += currencies[5].value < reactors[5].level ? 0 : reactors[5].level * constants[2] * reactors_puri[5].level * dt * 30 * 
            (1+(OPHWR.level)) * (1+(OMSR.level)) * Math.log2(bonus);
        currencies[8].value += currencies[5].value < reactors[5].level ? 0 : reactors[0].level * reactors[1].level * reactors[2].level * reactors[3].level * reactors[4].level * reactors[5].level * 
            BigNumber.from(constants[3]) * dt * reactors_puri[5].level * Math.log2(bonus) * (1+(OPHWR.level)) * (1+(OMSR.level));
    }
    //californium
    {
        let constants = [.4, .3, .2, 5e10];
        currencies[5].value += currencies[6].value < reactors[6].level ? 0 : reactors[6].level * constants[0] * dt * 30 * (1+(OPHWR.level)) * (1+(OMSR.level)) * Math.log2(bonus);

        currencies[6].value += currencies[6].value < reactors[6].level ? 0 : reactors[6].level * constants[1] * dt * 30 * Math.log2(bonus) * Math.log2(bonus);

        currencies[7].value += currencies[6].value < reactors[6].level ? 0 : reactors[6].level * constants[2] * reactors_puri[6].level * dt * 30 * 
            (1+(OPHWR.level)) * (1+(OMSR.level)) * (1+(OMSR.level)) * Math.log2(bonus);
        currencies[8].value += currencies[6].value < reactors[6].level ? 0 : reactors[0].level * reactors[1].level * reactors[2].level * reactors[3].level * reactors[4].level * reactors[5].level * reactors[6].level * 
            BigNumber.from(constants[3]) * dt * reactors_puri[6].level * Math.log2(bonus) * (1+(OPHWR.level)) * (1+(OMSR.level));
    }
    //tweaks decay
    currencies[0].value += -currencies[0].value * BigNumber.from(4.1341e-10) * dt * 30;
    let accessed = [
        [reactors[0].level, reactors_puri[0].level], [reactors[1].level, reactors_puri[1].level], [reactors[2].level, reactors_puri[2].level], 
        [reactors[3].level, reactors_puri[3].level], [reactors[4].level, reactors_puri[4].level], [reactors[5].level, reactors_puri[5].level],
        [reactors[6].level, reactors_puri[6].level]
    ];

    for (let i = 0; i < 7; ++i) {
        currencies[i].value += currencies[i].value < accessed[i][0] ? 0 : -accessed[i][0] * dt * accessed[i][1];
    }

    theory.invalidateQuaternaryValues();
}
var postPublish = () => {
    for (let i = 0; i < currencies.length; ++i) {
        currencies[i].value = BigNumber.ZERO;
    }
}
var getPrimaryEquation = () => "P = \\sum DE_s + \\sum RE_s";
var getSecondaryEquation = () => theory.latexSymbol + "=\\max P^{0.76}";
var getQuaternaryEntries = () => {
    if (quaternaryEntries.length == 0)
    {
        quaternaryEntries.push(new QuaternaryEntry("_{U}", null));
        quaternaryEntries.push(new QuaternaryEntry("_{Np}", null));
        quaternaryEntries.push(new QuaternaryEntry("_{Pu}", null));
        quaternaryEntries.push(new QuaternaryEntry("_{A_m}", null));
        quaternaryEntries.push(new QuaternaryEntry("_{C_m}", null));
        quaternaryEntries.push(new QuaternaryEntry("_{Bk}", null));
        quaternaryEntries.push(new QuaternaryEntry("_{Cf}", null));
        quaternaryEntries.push(new QuaternaryEntry("_{Es}", null));
    }
    for (let i = 0; i < 8; ++i) {
        quaternaryEntries[i].value = currencies[i].value;
    }
    return quaternaryEntries;
}
var getPublicationMultiplier = (tau) => tau.pow(0.256);
var getPublicationMultiplierFormula = (symbol) => symbol+"^{0.256}";
var getTau = () => currencies[8].value.pow(0.76);
var get2DGraphValue = () => currencies[8].value.sign * (BigNumber.ONE + currencies[8].value.abs()).log10().toNumber();
var getUm = (level) => Utils.getStepwisePowerSum(level, 1.0000000001, 10, 0);
var getUR = (level) => Utils.getStepwisePowerSum(level, 1.75, 7, 0);
var getNpR = (level) => Utils.getStepwisePowerSum(level, 2.75, 7.5, 0);
var getPuR = (level) => Utils.getStepwisePowerSum(level, 2.75, 7, 0);
var getAmR = (level) => Utils.getStepwisePowerSum(level, 2.8, 7, 0);
var getCmR = (level) => Utils.getStepwisePowerSum(level, 2.8, 6, 0);
var getBkR = (level) => Utils.getStepwisePowerSum(level, 3.3, 5, 0);
var getCfR = (level) => Utils.getStepwisePowerSum(level, 3.35, 5.5, 0);
var getOPHWR = (level) => Utils.getStepwisePowerSum(level,2,10,0);
var getOMSR = (level) => Utils.getStepwisePowerSum(level,2,10,0);
var getUD = (level) => BigNumber.TWO.pow(level);
var getURT = (level) => BigNumber.TWO.pow(level);
var getNpRT = (level) => BigNumber.TWO.pow(level);
var getPuRT = (level) => BigNumber.TWO.pow(level);
var getAmRT = (level) => BigNumber.TWO.pow(level);
var getCmRT = (level) => BigNumber.TWO.pow(level);
var getBkRT = (level) => BigNumber.TWO.pow(level);
var getCfRT = (level) => BigNumber.TWO.pow(level);
var getOI = (level) => BigNumber.SIX.pow(level);
var getUDExponent = (level) => BigNumber.from(1 + 0.1 * level);
init();
