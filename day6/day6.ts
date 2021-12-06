const fs = require("fs");
const FILENAME = "./day6/input.txt";
const file = fs.readFileSync(FILENAME, "UTF-8").split(",");
const initialFish = file.map((el) => parseInt(el));

const RESPAWN_TIME_FOR_EXISTING = 7;
const RESPAWN_TIME_FOR_NEW = 9;
const NUMBER_OF_DAYS_1 = 80;
const NUMBER_OF_DAYS_2 = 256;

const mod = (num: number, div: number): number => (div + (num % div)) % div;

const solution1 = (initialFish: Array<number>, number_of_days: number): number => {
  let currentFish: Array<number> = [...initialFish];

  for (let start = 0; start < number_of_days; start++) {
    let newFish: Array<number> = currentFish.reduce((accumulator, curr) => {
      let newLife: number = curr - 1;

      if (newLife < 0) {
        newLife = mod(curr - 1, RESPAWN_TIME_FOR_EXISTING);
        accumulator.push(RESPAWN_TIME_FOR_NEW - 1);
      }

      accumulator.push(newLife);
      return accumulator;
    }, []);
    currentFish = [...newFish];
  }

  return currentFish.reduce((acc, curr) => acc + 1, 0);
};

/* More optimized */
const solution2 = (initialFish: Array<number>, number_of_days: number): number => {
  let currentFishLifeMap: { [id: number]: number } = {};

  initialFish.map((fish) => {
    currentFishLifeMap[fish] = (currentFishLifeMap[fish] || 0) + 1;
  });

  for (let start = 0; start < number_of_days; start++) {
    let numRespawns = currentFishLifeMap[0];

    for (let lifeValue = 1; lifeValue < RESPAWN_TIME_FOR_NEW; lifeValue++) {
      let numReductions = currentFishLifeMap[lifeValue] || 0;
      currentFishLifeMap[lifeValue - 1] = numReductions;
      currentFishLifeMap[lifeValue] = 0;
    }

    if (numRespawns > 0) {
      currentFishLifeMap[RESPAWN_TIME_FOR_NEW - 1] = numRespawns;
      currentFishLifeMap[RESPAWN_TIME_FOR_EXISTING - 1] =
        (currentFishLifeMap[RESPAWN_TIME_FOR_EXISTING - 1] || 0) + numRespawns;
    }
  }

  return Object.keys(currentFishLifeMap).reduce((acc, curr) => {
    acc += currentFishLifeMap[curr] || 0;
    return acc;
  }, 0);
};

const main = (): void => {
  console.log(solution1(initialFish, NUMBER_OF_DAYS_1));
  console.log(solution2(initialFish, NUMBER_OF_DAYS_2));
};

main();
