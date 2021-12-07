var fs = require("fs");
var FILENAME = "./day7/input.txt";
var file = fs.readFileSync(FILENAME, "UTF-8").split(",");
var solution1 = function (initialCrabs) {
    var mapOfPositions = {};
    initialCrabs.map(function (position) {
        mapOfPositions[position] = (mapOfPositions[position] || 0) + 1;
    });
    var possiblePositions = (Object.keys(mapOfPositions).map(function (el) { return parseInt(el); })).sort(function (a, b) { return a - b; });
    var cheapestFuel = Number.MAX_VALUE;
    var _loop_1 = function (i) {
        var fuelCost = possiblePositions.reduce(function (acc, current) { return acc + Math.abs(current - i) * mapOfPositions[current]; }, 0);
        cheapestFuel = Math.min(fuelCost, cheapestFuel);
    };
    for (var i = possiblePositions.at(0); i <= possiblePositions.at(-1); i++) {
        _loop_1(i);
    }
    return cheapestFuel;
};
var solution2 = function (initialCrabs) {
    var individualFuelCost = function (fromPosition, toPosition) {
        var distance = Math.abs(toPosition - fromPosition);
        return (distance * distance + distance) / 2;
    };
    var mapOfPositions = {};
    initialCrabs.map(function (position) {
        mapOfPositions[position] = (mapOfPositions[position] || 0) + 1;
    });
    var possiblePositions = (Object.keys(mapOfPositions).map(function (el) { return parseInt(el); })).sort(function (a, b) { return a - b; });
    var cheapestFuel = Number.MAX_VALUE;
    var _loop_2 = function (i) {
        var fuelCost = possiblePositions.reduce(function (acc, current) { return acc + (individualFuelCost(current, i) * mapOfPositions[current]); }, 0);
        cheapestFuel = Math.min(fuelCost, cheapestFuel);
    };
    for (var i = possiblePositions.at(0); i <= possiblePositions.at(-1); i++) {
        _loop_2(i);
    }
    return cheapestFuel;
};
var main = function () {
    var initialCrabs = file;
    console.log(solution1(initialCrabs));
    console.log(solution2(initialCrabs));
};
main();
