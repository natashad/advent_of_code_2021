const fs = require("fs");
const FILENAME = "./day10/test_input.txt";
const file = fs.readFileSync(FILENAME, "UTF-8").split(/\r?\n/);

const readLines = (file): Array<Sequence> => {
  return file.map((line) => line.split(""));
};

type Brace = "(" | ")" | "[" | "]" | "{" | "}" | "<" | ">";

type Sequence = Array<Brace>;

interface SequenceError {
  corruptCharacter: Brace;
  incomplete: Array<Brace>;
}

const braceMatcher: { [id: string]: Brace } = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
};

const corruptionPointCalculator: { [id: string]: number } = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

const incompletePointCalculator = (incomplete: Array<Brace>): number => {
  const pointMap: { [id: string]: number } = {
    ")": 1,
    "]": 2,
    "}": 3,
    ">": 4,
  };

  return incomplete
    .map((brace) => braceMatcher[brace])
    .reverse()
    .reduce((acc, curr) => acc * 5 + pointMap[curr], 0);
};

const parseSequence = (sequence: Sequence): SequenceError => {
  let activeBraces: Array<Brace> = [];
  while (sequence.length) {
    let current: Brace = sequence.shift();
    if (Object.keys(braceMatcher).includes(current)) {
      activeBraces.push(current);
    } else {
      if (
        activeBraces.length &&
        braceMatcher[activeBraces.at(-1)] === current
      ) {
        activeBraces.pop();
      } else {
        return {
          corruptCharacter: current,
          incomplete: [],
        };
      }
    }
  }

  return {
    corruptCharacter: null,
    incomplete: activeBraces,
  };
};

const solution1 = (lines: Array<Sequence>): number => {
  return lines
    .map((line) => parseSequence(line))
    .reduce((acc, curr) => {
      return acc + (corruptionPointCalculator[curr.corruptCharacter] || 0);
    }, 0);
};

const solution2 = (lines: Array<Sequence>): number => {
  const scores: Array<number> = lines
    .map((line) => parseSequence(line))
    .filter((result) => result.incomplete.length > 0)
    .map((result) => incompletePointCalculator(result.incomplete));

  return scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)];
};

const main = (): void => {
  console.log(solution1(readLines(file)));
  console.log(solution2(readLines(file)));
};

main();
