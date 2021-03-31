import { data } from "./lmd.js";
import { finalEnergy } from './load_calc.js';

//export let listOfFenders = [];

function getList(list, fenders, min, max) {

    for (let i in fenders) {
        let current = +fenders[i].energy;

        if (min < current && current < max) {
            list.push(fenders[i]);
        }
    }
}

export function fenderSelect() {

    let fenders = JSON.parse(data);
    let list = [];

    getList(list, fenders, (finalEnergy.Min * 1.01), (finalEnergy.Min * 1.25));
    if (finalEnergy.Max != 0) {
        getList(list, fenders, (finalEnergy.Max * 1.01), (finalEnergy.Max * 1.25));
    }
    //listOfFenders = list;
    return list;
}