var fs = require("fs");
var FILENAME = "./day10/test_input.txt";
var file = fs.readFileSync(FILENAME, "UTF-8").split(/\r?\n/);
var readLines = function (file) {
    return file.map(function (line) { return line.split(""); });
};
var braceMatcher = {
    "(": ")",
    "[": "]",
    "{": "}",
    "<": ">"
};
var corruptionPointCalculator = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137
};
var incompletePointCalculator = function (incomplete) {
    var pointMap = {
        ")": 1,
        "]": 2,
        "}": 3,
        ">": 4
    };
    return incomplete.map(function (brace) { return braceMatcher[brace]; }).reverse().reduce(function (acc, curr) { return ((acc * 5) + pointMap[curr]); }, 0);
};
var parseSequence = function (sequence) {
    var activeBraces = [];
    while (sequence.length) {
        var current = sequence.shift();
        if (Object.keys(braceMatcher).includes(current)) {
            activeBraces.push(current);
        }
        else {
            if (activeBraces.length &&
                braceMatcher[activeBraces.at(-1)] === current) {
                activeBraces.pop();
            }
            else {
                return {
                    corruptCharacter: current,
                    incomplete: []
                };
            }
        }
    }
    return {
        corruptCharacter: null,
        incomplete: activeBraces
    };
};
var solution1 = function (lines) {
    return lines
        .map(function (line) { return parseSequence(line); })
        .reduce(function (acc, curr) {
        return acc + (corruptionPointCalculator[curr.corruptCharacter] || 0);
    }, 0);
};
var solution2 = function (lines) {
    var scores = lines
        .map(function (line) { return parseSequence(line); })
        .filter(function (result) { return result.incomplete.length > 0; })
        .map(function (result) { return incompletePointCalculator(result.incomplete); });
    return scores.sort(function (a, b) { return a - b; })[Math.floor(scores.length / 2)];
};
var main = function () {
    console.log(solution1(readLines(file)));
    console.log(solution2(readLines(file)));
};
main();
