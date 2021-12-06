var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var fs = require("fs");
var FILENAME = "./day6/input.txt";
var file = fs.readFileSync(FILENAME, "UTF-8").split(",");
var initialFish = file.map(function (el) { return parseInt(el); });
var RESPAWN_TIME_FOR_EXISTING = 7;
var RESPAWN_TIME_FOR_NEW = 9;
var NUMBER_OF_DAYS_1 = 80;
var NUMBER_OF_DAYS_2 = 256;
var mod = function (num, div) { return (div + (num % div)) % div; };
var solution1 = function (initialFish, number_of_days) {
    var currentFish = __spreadArray([], initialFish, true);
    for (var start = 0; start < number_of_days; start++) {
        var newFish = currentFish.reduce(function (accumulator, curr) {
            var newLife = curr - 1;
            if (newLife < 0) {
                newLife = mod(curr - 1, RESPAWN_TIME_FOR_EXISTING);
                accumulator.push(RESPAWN_TIME_FOR_NEW - 1);
            }
            accumulator.push(newLife);
            return accumulator;
        }, []);
        currentFish = __spreadArray([], newFish, true);
    }
    return currentFish.reduce(function (acc, curr) { return acc + 1; }, 0);
};
/* More optimized */
var solution2 = function (initialFish, number_of_days) {
    var currentFishLifeMap = {};
    initialFish.map(function (fish) {
        currentFishLifeMap[fish] = (currentFishLifeMap[fish] || 0) + 1;
    });
    for (var start = 0; start < number_of_days; start++) {
        var numRespawns = currentFishLifeMap[0];
        for (var lifeValue = 1; lifeValue < RESPAWN_TIME_FOR_NEW; lifeValue++) {
            var numReductions = currentFishLifeMap[lifeValue] || 0;
            currentFishLifeMap[lifeValue - 1] = numReductions;
            currentFishLifeMap[lifeValue] = 0;
        }
        if (numRespawns > 0) {
            currentFishLifeMap[RESPAWN_TIME_FOR_NEW - 1] = numRespawns;
            currentFishLifeMap[RESPAWN_TIME_FOR_EXISTING - 1] =
                (currentFishLifeMap[RESPAWN_TIME_FOR_EXISTING - 1] || 0) + numRespawns;
        }
    }
    return Object.keys(currentFishLifeMap).reduce(function (acc, curr) {
        acc += currentFishLifeMap[curr] || 0;
        return acc;
    }, 0);
};
var main = function () {
    console.log(solution1(initialFish, NUMBER_OF_DAYS_1));
    console.log(solution2(initialFish, NUMBER_OF_DAYS_2));
};
main();
