var fs = require("fs");
var FILENAME = "./day11/input.txt";
var file = fs.readFileSync(FILENAME, "UTF-8").split(/\r?\n/);
var readGrid = function (file) {
    return file.map(function (line) { return line.split("").map(function (el) { return parseInt(el); }); });
};
var strPoint = function (point) { return JSON.stringify(point); };
var unstrPoint = function (point) { return JSON.parse(point); };
var getNeighbours = function (point, grid) {
    var neighbourOffsets = [
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: -1 },
        { x: -1, y: 0 },
        { x: -1, y: 1 },
        { x: 1, y: -1 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
    ];
    return neighbourOffsets.reduce(function (acc, curr) {
        var neighbour = { x: point.x + curr.x, y: point.y + curr.y };
        if (!(neighbour.x < 0 ||
            neighbour.x >= grid.length ||
            neighbour.y < 0 ||
            neighbour.y >= grid[0].length)) {
            acc.push(neighbour);
        }
        return acc;
    }, []);
};
var flash = function (grid, flashes) {
    var visitedFlashes = new Set();
    var iter = flashes.values();
    var flash = iter.next().value;
    while (flash) {
        flashes["delete"](flash);
        visitedFlashes.add(flash);
        var neighbours = getNeighbours(unstrPoint(flash), grid);
        neighbours.map(function (neighbour) {
            var neighbourVal = grid[neighbour.x][neighbour.y];
            var neighbourStr = strPoint({ x: neighbour.x, y: neighbour.y });
            if (neighbourVal === 9 && !visitedFlashes.has(neighbourStr)) {
                flashes.add(neighbourStr);
            }
            grid[neighbour.x][neighbour.y] = neighbourVal + 1;
        });
        flash = iter.next().value;
    }
    Array.from(visitedFlashes).map(function (flash) {
        var flashPoint = unstrPoint(flash);
        grid[flashPoint.x][flashPoint.y] = 0;
    });
    return grid;
};
var runStep = function (grid) {
    var nines = new Set();
    var updatedGrid = [];
    grid.map(function (row, rowIdx) {
        return row.map(function (col, colIdx) {
            if (col + 1 > 9) {
                nines.add(strPoint({ x: rowIdx, y: colIdx }));
            }
            updatedGrid[rowIdx] = updatedGrid[rowIdx] || [];
            updatedGrid[rowIdx][colIdx] = col + 1;
        });
    });
    return flash(updatedGrid, nines);
};
var solution1 = function (grid, numSteps) {
    var numFlashes = 0;
    for (var i = 0; i < numSteps; i++) {
        grid = runStep(grid);
        numFlashes += grid.flat().filter(function (val) { return val === 0; }).length;
    }
    return numFlashes;
};
var solution2 = function (grid) {
    for (var i = 0;; i++) {
        grid = runStep(grid);
        if (grid.flat().reduce(function (acc, curr) { return acc + curr; }, 0) === 0)
            return i + 1;
    }
};
var main = function () {
    console.log(solution1(readGrid(file), 100));
    console.log(solution2(readGrid(file)));
};
main();
