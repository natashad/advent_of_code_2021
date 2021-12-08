var fs = require("fs");
var FILENAME = "./day8/input.txt";
var file = fs.readFileSync(FILENAME, "UTF-8").split(/\r?\n/);
var getLineOutput = function (line) {
    return line.split(" | ")[1].split(" ");
};
var getLineInput = function (line) {
    return line.split(" | ")[0].split(" ");
};
var getDifference = function (containingWord, containedWord) {
    var w1 = containingWord.split("");
    var w2 = containedWord.split("");
    return w1.filter(function (x) { return !w2.includes(x); });
};
var solution1 = function (lines, signalMap) {
    var output = lines.flatMap(getLineOutput);
    var numbersToCheck = [1, 4, 7, 8];
    var supportedLengths = numbersToCheck.map(function (num) {
        return signalMap[num.toString()].length;
    });
    return output.reduce(function (acc, current) {
        return supportedLengths.includes(current.length) ? acc + 1 : acc;
    }, 0);
};
var solution2 = function (lines, signalMap) {
    var finalOutput = 0;
    var _loop_1 = function (line) {
        var letterMapping = {};
        var input = getLineInput(line);
        /* for a = missing letter between the 2 and 3 letter words */
        var inputsBySize = input.reduce(function (acc, curr) {
            acc[curr.length] = (acc[curr.length] || []).concat(curr);
            return acc;
        }, {});
        letterMapping["a"] = getDifference(inputsBySize["3"][0], inputsBySize["2"][0])[0];
        /* NUMBER OF APPEARANCES IN PATTERNS
          a = 8 (Exclude)
          b = 6
          c = 8
          d = 7 <-- TODO
          e = 4
          f = 9
          g = 7 <-- TODO
        */
        // for b, c, e, f
        var numAppearencesPerLetter = {};
        for (var _a = 0, input_1 = input; _a < input_1.length; _a++) {
            var inp = input_1[_a];
            for (var _b = 0, _c = inp.split(""); _b < _c.length; _b++) {
                var letter = _c[_b];
                if (letter === letterMapping["a"])
                    continue;
                numAppearencesPerLetter[letter] =
                    (numAppearencesPerLetter[letter] || 0) + 1;
            }
        }
        for (var _d = 0, _e = Object.keys(numAppearencesPerLetter); _d < _e.length; _d++) {
            var letter = _e[_d];
            switch (numAppearencesPerLetter[letter]) {
                case 6:
                    letterMapping["b"] = letter;
                    break;
                case 8:
                    letterMapping["c"] = letter;
                    break;
                case 4:
                    letterMapping["e"] = letter;
                    break;
                case 9:
                    letterMapping["f"] = letter;
                    break;
            }
        }
        // for d (d = 8 - 0)
        // 8 was trivially the only input with 7 digits, 0 is any 6 digit input that matches that except for 1 letter that hasn't already been solved for
        var eighthSegment = inputsBySize["7"][0];
        for (var _f = 0, _g = inputsBySize["6"]; _f < _g.length; _f++) {
            var inp = _g[_f];
            var difference = getDifference(eighthSegment, inp);
            if (difference.length === 1 &&
                !Object.values(letterMapping).includes(difference[0])) {
                letterMapping["d"] = difference[0];
                break;
            }
        }
        // g is the remaining letter
        var g = "abcdefg"
            .split("")
            .filter(function (x) { return !Object.values(letterMapping).includes(x); })[0];
        letterMapping["g"] = g;
        // Handle output calculation
        var transformedSignalMap = {};
        for (var i = 0; i < signalMap.length; i++) {
            transformedSignalMap[signalMap[i]
                .split("")
                .map(function (letter) { return letterMapping[letter]; })
                .sort()
                .join("")] = i;
        }
        var output = getLineOutput(line);
        finalOutput += parseInt(output
            .map(function (word) { return transformedSignalMap[word.split("").sort().join("")]; })
            .join(""));
    };
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        _loop_1(line);
    }
    return finalOutput;
};
var main = function () {
    var lines = file;
    var signalMap = [
        "abcefg",
        "cf",
        "acdeg",
        "acdfg",
        "bcdf",
        "abdfg",
        "abdefg",
        "acf",
        "abcdefg",
        "abcdfg",
    ];
    console.log(solution1(lines, signalMap));
    console.log(solution2(lines, signalMap));
};
main();
