const fs = require("fs");
const FILENAME = "./day5/input.txt";
const file = fs.readFileSync(FILENAME, "UTF-8").split(/\r?\n/);

interface Line {
  start: [number, number];
  end: [number, number];
}

enum Direction {
  Horizontal,
  Vertical,
  Diagonal,
}

const lines: Array<Line> = file.map((fileLine: string) => {
  const points: Array<string> = fileLine.split("->");
  const start: Array<number> = points[0].split(",").map((el) => parseInt(el));
  const end: Array<number> = points[1].split(",").map((el) => parseInt(el));

  return {
    start,
    end,
  };
});

const getMovingCoordinate = (start: number, end: number): Array<number> => {
  let direction: number = Math.sign(end - start);
  let coveredCoordinates: Array<number> = [];
  for (let i = start; i != end + direction; i += direction) {
    coveredCoordinates.push(i);
  }
  return coveredCoordinates;
};

const getOverlapCount = (usedSpaces: { [id: string]: number }): number => {
  return Object.values(usedSpaces).reduce(
    (accumulator, current) => (current > 1 ? ++accumulator : accumulator),
    0
  );
};

const solution1 = (lines: Array<Line>): number => {
  let usedSpaces: { [id: string]: number } = {};

  const nonDiagonalLines: Array<Line> = lines.filter((line) => {
    return line.start[0] == line.end[0] || line.start[1] == line.end[1];
  });
  for (let line of nonDiagonalLines) {
    let isHorizontal: boolean = line.start[1] == line.end[1];

    if (isHorizontal) {
      let xCoordinates = getMovingCoordinate(line.start[0], line.end[0]);
      xCoordinates.map((x) => {
        let key: string = JSON.stringify([x, line.start[1]]);
        usedSpaces[key] = (usedSpaces[key] || 0) + 1;
      });
    } else {
      let yCoordinates = getMovingCoordinate(line.start[1], line.end[1]);
      yCoordinates.map((y) => {
        let key: string = JSON.stringify([line.start[0], y]);
        usedSpaces[key] = (usedSpaces[key] || 0) + 1;
      });
    }
  }

  return getOverlapCount(usedSpaces);
};

const solution2 = (lines: Array<Line>): number => {
  let usedSpaces: { [id: string]: number } = {};

  for (let line of lines) {
    let movementDirection: Direction = Direction.Diagonal;
    if (line.start[1] == line.end[1]) {
      movementDirection = Direction.Horizontal;
    } else if (line.start[0] == line.end[0]) {
      movementDirection = Direction.Vertical;
    }
    if (movementDirection === Direction.Horizontal) {
      let xCoordinates: Array<number> = getMovingCoordinate(
        line.start[0],
        line.end[0]
      );
      xCoordinates.map((x) => {
        let key: string = JSON.stringify([x, line.start[1]]);
        usedSpaces[key] = (usedSpaces[key] || 0) + 1;
      });
    } else if (movementDirection === Direction.Vertical) {
      let yCoordinates: Array<number> = getMovingCoordinate(
        line.start[1],
        line.end[1]
      );
      yCoordinates.map((y) => {
        let key: string = JSON.stringify([line.start[0], y]);
        usedSpaces[key] = (usedSpaces[key] || 0) + 1;
      });
    } else {
      let xCoordinates: Array<number> = getMovingCoordinate(
        line.start[0],
        line.end[0]
      );
      let yCoordinates: Array<number> = getMovingCoordinate(
        line.start[1],
        line.end[1]
      );
      let zippedCoordinates: Array<[number, number]> = xCoordinates.map(
        (x, index) => [x, yCoordinates[index]]
      );
      zippedCoordinates.map((coord) => {
        let key: string = JSON.stringify(coord);
        usedSpaces[key] = (usedSpaces[key] || 0) + 1;
      });
    }
  }

  return getOverlapCount(usedSpaces);
};

const main = (): void => {
  console.log(solution1(lines));
  console.log(solution2(lines));
};

main();
