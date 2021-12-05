var fs = require("fs");
var FILENAME = "./day5/input.txt";
var file = fs.readFileSync(FILENAME, "UTF-8").split(/\r?\n/);
var Direction;
(function (Direction) {
    Direction[Direction["Horizontal"] = 0] = "Horizontal";
    Direction[Direction["Vertical"] = 1] = "Vertical";
    Direction[Direction["Diagonal"] = 2] = "Diagonal";
})(Direction || (Direction = {}));
var lines = file.map(function (fileLine) {
    var points = fileLine.split("->");
    var start = points[0].split(",").map(function (el) { return parseInt(el); });
    var end = points[1].split(",").map(function (el) { return parseInt(el); });
    return {
        start: start,
        end: end
    };
});
var getMovingCoordinate = function (start, end) {
    var direction = Math.sign(end - start);
    var coveredCoordinates = [];
    for (var i = start; i != end + direction; i += direction) {
        coveredCoordinates.push(i);
    }
    return coveredCoordinates;
};
var getOverlapCount = function (usedSpaces) {
    return Object.values(usedSpaces).reduce(function (accumulator, current) { return (current > 1 ? ++accumulator : accumulator); }, 0);
};
var solution1 = function (lines) {
    var usedSpaces = {};
    var nonDiagonalLines = lines.filter(function (line) {
        return line.start[0] == line.end[0] || line.start[1] == line.end[1];
    });
    var _loop_1 = function (line) {
        var isHorizontal = line.start[1] == line.end[1];
        if (isHorizontal) {
            var xCoordinates = getMovingCoordinate(line.start[0], line.end[0]);
            xCoordinates.map(function (x) {
                var key = JSON.stringify([x, line.start[1]]);
                usedSpaces[key] = (usedSpaces[key] || 0) + 1;
            });
        }
        else {
            var yCoordinates = getMovingCoordinate(line.start[1], line.end[1]);
            yCoordinates.map(function (y) {
                var key = JSON.stringify([line.start[0], y]);
                usedSpaces[key] = (usedSpaces[key] || 0) + 1;
            });
        }
    };
    for (var _i = 0, nonDiagonalLines_1 = nonDiagonalLines; _i < nonDiagonalLines_1.length; _i++) {
        var line = nonDiagonalLines_1[_i];
        _loop_1(line);
    }
    return getOverlapCount(usedSpaces);
};
var solution2 = function (lines) {
    var usedSpaces = {};
    var _loop_2 = function (line) {
        var movementDirection = Direction.Diagonal;
        if (line.start[1] == line.end[1]) {
            movementDirection = Direction.Horizontal;
        }
        else if (line.start[0] == line.end[0]) {
            movementDirection = Direction.Vertical;
        }
        if (movementDirection === Direction.Horizontal) {
            var xCoordinates = getMovingCoordinate(line.start[0], line.end[0]);
            xCoordinates.map(function (x) {
                var key = JSON.stringify([x, line.start[1]]);
                usedSpaces[key] = (usedSpaces[key] || 0) + 1;
            });
        }
        else if (movementDirection === Direction.Vertical) {
            var yCoordinates = getMovingCoordinate(line.start[1], line.end[1]);
            yCoordinates.map(function (y) {
                var key = JSON.stringify([line.start[0], y]);
                usedSpaces[key] = (usedSpaces[key] || 0) + 1;
            });
        }
        else {
            var xCoordinates = getMovingCoordinate(line.start[0], line.end[0]);
            var yCoordinates_1 = getMovingCoordinate(line.start[1], line.end[1]);
            var zippedCoordinates = xCoordinates.map(function (x, index) { return [x, yCoordinates_1[index]]; });
            zippedCoordinates.map(function (coord) {
                var key = JSON.stringify(coord);
                usedSpaces[key] = (usedSpaces[key] || 0) + 1;
            });
        }
    };
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        _loop_2(line);
    }
    return getOverlapCount(usedSpaces);
};
var main = function () {
    console.log(solution1(lines));
    console.log(solution2(lines));
};
main();
