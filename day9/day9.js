var fs = require("fs");
var FILENAME = "./day9/input.txt";
var file = fs.readFileSync(FILENAME, "UTF-8").split(/\r?\n/);
var outOfBounds = function (point, numRows, numCols) {
    return (point[0] < 0 || point[0] >= numRows || point[1] < 0 || point[1] >= numCols);
};
var getNeighbours = function (point, numRows, numCols) {
    var neighbourOffsets = [
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0],
    ];
    var neighbours = neighbourOffsets.reduce(function (acc, curr) {
        var x = point[0] + curr[0];
        var y = point[1] + curr[1];
        if (!outOfBounds([x, y], numRows, numCols))
            acc.push([x, y]);
        return acc;
    }, []);
    return neighbours;
};
var getLowPoints = function (grid) {
    var neighbours = [
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0],
    ];
    var numRows = grid.length;
    var numCols = grid[0].length;
    var lowPoints = [];
    for (var row = 0; row < numRows; row++) {
        var _loop_1 = function (col) {
            var pointValue = grid[row][col];
            var isLowPoint = getNeighbours([row, col], numRows, numCols).reduce(function (acc, curr) {
                return acc && pointValue < grid[curr[0]][curr[1]];
            }, true);
            if (isLowPoint)
                lowPoints.push([row, col]);
        };
        for (var col = 0; col < numCols; col++) {
            _loop_1(col);
        }
    }
    return lowPoints;
};
var solution1 = function (grid) {
    var lowPoints = getLowPoints(grid);
    return (lowPoints.length +
        lowPoints.reduce(function (acc, curr) { return acc + grid[curr[0]][curr[1]]; }, 0));
};
var solution2 = function (grid) {
    var lowPoints = getLowPoints(grid);
    var numRows = grid.length;
    var numCols = grid[0].length;
    var findBasin = function (currentBasin, grid) {
        var listToProcess = [JSON.stringify(currentBasin)];
        var basinList = [];
        while (listToProcess.length) {
            var point = JSON.parse(listToProcess.pop());
            basinList.push(JSON.stringify(point));
            var neighbours = getNeighbours(point, numRows, numCols);
            neighbours.map(function (neighbour) {
                var pointValue = grid[neighbour[0]][neighbour[1]];
                var neighbourString = JSON.stringify(neighbour);
                if (pointValue !== 9 &&
                    !basinList.includes(neighbourString) &&
                    !listToProcess.includes(neighbourString)) {
                    listToProcess.push(JSON.stringify(neighbour));
                }
            });
        }
        return basinList;
    };
    var basinLengths = lowPoints.map(function (point) { return findBasin(point, grid).length; });
    return basinLengths
        .sort(function (a, b) { return b - a; })
        .splice(0, 3)
        .reduce(function (acc, current) { return acc * current; }, 1);
};
var main = function () {
    var grid = file.map(function (line) { return line.split("").map(function (el) { return parseInt(el); }); });
    console.log(solution1(grid));
    console.log(solution2(grid));
};
main();
