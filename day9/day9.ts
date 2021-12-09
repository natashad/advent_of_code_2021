const fs = require("fs");
const FILENAME = "./day9/input.txt";
const file = fs.readFileSync(FILENAME, "UTF-8").split(/\r?\n/);

type Point = [number, number];

const outOfBounds = (
  point: Point,
  numRows: number,
  numCols: number
): boolean => {
  return (
    point[0] < 0 || point[0] >= numRows || point[1] < 0 || point[1] >= numCols
  );
};

const getNeighbours = (
  point: Point,
  numRows: number,
  numCols: number
): Array<Point> => {
  const neighbourOffsets: Array<Point> = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
  ];

  let neighbours: Array<Point> = neighbourOffsets.reduce(
    (acc: Array<Point>, curr: Point) => {
      let x: number = point[0] + curr[0];
      let y: number = point[1] + curr[1];
      if (!outOfBounds([x, y], numRows, numCols)) acc.push([x, y]);
      return acc;
    },
    []
  );

  return neighbours;
};

const getLowPoints = (grid: Array<Point>) => {
  const neighbours: Array<Point> = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
  ];

  const numRows = grid.length;
  const numCols = grid[0].length;
  let lowPoints: Array<Point> = [];

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      let pointValue = grid[row][col];

      let isLowPoint = getNeighbours([row, col], numRows, numCols).reduce(
        (acc, curr) => {
          return acc && pointValue < grid[curr[0]][curr[1]];
        },
        true
      );

      if (isLowPoint) lowPoints.push([row, col]);
    }
  }

  return lowPoints;
};

const solution1 = (grid: Array<Point>): number => {
  let lowPoints: Array<Point> = getLowPoints(grid);
  return (
    lowPoints.length +
    lowPoints.reduce((acc, curr) => acc + grid[curr[0]][curr[1]], 0)
  );
};

const solution2 = (grid: Array<Point>): number => {
  const lowPoints: Array<Point> = getLowPoints(grid);
  const numRows = grid.length;
  const numCols = grid[0].length;

  const findBasin = (
    currentBasin: Point,
    grid: Array<Point>
  ): Array<string> => {
    let listToProcess: Array<string> = [JSON.stringify(currentBasin)];
    let basinList: Array<string> = [];

    while (listToProcess.length) {
      let point: Point = <Point>JSON.parse(listToProcess.pop());
      basinList.push(JSON.stringify(point));

      const neighbours: Array<Point> = getNeighbours(point, numRows, numCols);
      neighbours.map((neighbour: Point) => {
        let pointValue = grid[neighbour[0]][neighbour[1]];

        let neighbourString: string = JSON.stringify(neighbour);
        if (
          pointValue !== 9 &&
          !basinList.includes(neighbourString) &&
          !listToProcess.includes(neighbourString)
        ) {
          listToProcess.push(JSON.stringify(neighbour));
        }
      });
    }

    return basinList;
  };

  const basinLengths: Array<number> = lowPoints.map(
    (point: Point) => findBasin(point, grid).length
  );
  return basinLengths
    .sort((a, b) => b - a)
    .splice(0, 3)
    .reduce((acc, current) => acc * current, 1);
};

const main = (): void => {
  const grid = file.map((line) => line.split("").map((el) => parseInt(el)));

  console.log(solution1(grid));
  console.log(solution2(grid));
};

main();
