const fs = require("fs");
const FILENAME = "./day11/input.txt";
const file = fs.readFileSync(FILENAME, "UTF-8").split(/\r?\n/);

const readGrid = (file): Grid => {
  return file.map((line) => line.split("").map((el) => parseInt(el)));
};

interface Point {
  x: number;
  y: number;
}

type Grid = Array<Array<number>>;

const strPoint = (point: Point): string => JSON.stringify(point);
const unstrPoint = (point: string): Point => JSON.parse(point);

const getNeighbours = (point: Point, grid: Grid): Array<Point> => {
  const neighbourOffsets = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: -1 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: 1, y: -1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
  ];
  return neighbourOffsets.reduce((acc, curr) => {
    const neighbour: Point = { x: point.x + curr.x, y: point.y + curr.y };
    if (
      !(
        neighbour.x < 0 ||
        neighbour.x >= grid.length ||
        neighbour.y < 0 ||
        neighbour.y >= grid[0].length
      )
    ) {
      acc.push(neighbour);
    }
    return acc;
  }, []);
};

const flash = (grid: Grid, flashes: Set<string>): Grid => {
  let visitedFlashes: Set<string> = new Set();

  let iter = flashes.values();
  let flash = iter.next().value;
  while (flash) {
    flashes.delete(flash);
    visitedFlashes.add(flash);

    let neighbours: Array<Point> = getNeighbours(unstrPoint(flash), grid);

    neighbours.map((neighbour) => {
      let neighbourVal: number = grid[neighbour.x][neighbour.y];
      let neighbourStr: string = strPoint({ x: neighbour.x, y: neighbour.y });
      if (neighbourVal === 9 && !visitedFlashes.has(neighbourStr)) {
        flashes.add(neighbourStr);
      }
      grid[neighbour.x][neighbour.y] = neighbourVal + 1;
    });

    flash = iter.next().value;
  }

  Array.from(visitedFlashes).map((flash) => {
    let flashPoint: Point = unstrPoint(flash);
    grid[flashPoint.x][flashPoint.y] = 0;
  });

  return grid;
};

const runStep = (grid: Grid): Grid => {
  let nines: Set<string> = new Set();
  let updatedGrid: Grid = [];

  grid.map((row, rowIdx) => {
    return row.map((col, colIdx) => {
      if (col + 1 > 9) {
        nines.add(strPoint({ x: rowIdx, y: colIdx }));
      }
      updatedGrid[rowIdx] = updatedGrid[rowIdx] || [];
      updatedGrid[rowIdx][colIdx] = col + 1;
    });
  });

  return flash(updatedGrid, nines);
};

const solution1 = (grid: Grid, numSteps: number): number => {
  let numFlashes = 0;
  for (let i = 0; i < numSteps; i++) {
    grid = runStep(grid);
    numFlashes += grid.flat().filter((val) => val === 0).length;
  }

  return numFlashes;
};

const solution2 = (grid: Grid): number => {
  for (let i = 0; ; i++) {
    grid = runStep(grid);
    if (grid.flat().reduce((acc, curr) => acc + curr, 0) === 0) return i + 1;
  }
};

const main = (): void => {
  console.log(solution1(readGrid(file), 100));
  console.log(solution2(readGrid(file)));
};

main();
