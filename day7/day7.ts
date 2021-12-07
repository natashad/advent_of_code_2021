const fs = require("fs");
const FILENAME = "./day7/input.txt";
const file = fs.readFileSync(FILENAME, "UTF-8").split(",");

const solution1 = (initialCrabs: Array<string>): number => {
  let mapOfPositions: { [id: string]: number } = {};
  initialCrabs.map((position) => {
    mapOfPositions[position] = (mapOfPositions[position] || 0) + 1;
  });

  let possiblePositions: Array<number> = (<Array<number>>(
    Object.keys(mapOfPositions).map((el) => parseInt(el))
  )).sort((a, b) => a - b);
  let cheapestFuel: number = Number.MAX_VALUE;
  for (let i = possiblePositions.at(0); i <= possiblePositions.at(-1); i++) {
    let fuelCost: number = possiblePositions.reduce(
      (acc, current) => acc + Math.abs(current - i) * mapOfPositions[current],
      0
    );
    cheapestFuel = Math.min(fuelCost, cheapestFuel);
  }
  return cheapestFuel;
};

const solution2 = (initialCrabs: Array<string>): number => {
  const individualFuelCost = (
    fromPosition: number,
    toPosition: number
  ): number => {
    let distance: number = Math.abs(toPosition - fromPosition);
    return (distance * distance + distance) / 2;
  };

  let mapOfPositions: { [id: string]: number } = {};
  initialCrabs.map((position) => {
    mapOfPositions[position] = (mapOfPositions[position] || 0) + 1;
  });

  let possiblePositions: Array<number> = (<Array<number>>(
    Object.keys(mapOfPositions).map((el) => parseInt(el))
  )).sort((a, b) => a - b);
  let cheapestFuel: number = Number.MAX_VALUE;
  for (let i = possiblePositions.at(0); i <= possiblePositions.at(-1); i++) {
    let fuelCost: number = possiblePositions.reduce(
      (acc, current) =>
        acc + individualFuelCost(current, i) * mapOfPositions[current],
      0
    );
    cheapestFuel = Math.min(fuelCost, cheapestFuel);
  }
  return cheapestFuel;
};

const main = (): void => {
  const initialCrabs: Array<string> = file;
  console.log(solution1(initialCrabs));
  console.log(solution2(initialCrabs));
};

main();
