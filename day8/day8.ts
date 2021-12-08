const fs = require("fs");
const FILENAME = "./day8/input.txt";
const file = fs.readFileSync(FILENAME, "UTF-8").split(/\r?\n/);

const getLineOutput = (line: string): Array<string> => {
  return line.split(" | ")[1].split(" ");
};

const getLineInput = (line: string): Array<string> => {
  return line.split(" | ")[0].split(" ");
};

const getDifference = (containingWord: string, containedWord: string) => {
  let w1 = containingWord.split("");
  let w2 = containedWord.split("");

  return w1.filter((x) => !w2.includes(x));
};

const solution1 = (lines: Array<string>, signalMap: Array<string>): number => {
  const output: Array<string> = lines.flatMap(getLineOutput);

  let numbersToCheck: Array<number> = [1, 4, 7, 8];
  let supportedLengths: Array<number> = numbersToCheck.map((num) => {
    return signalMap[num.toString()].length;
  });

  return output.reduce((acc, current) => {
    return supportedLengths.includes(current.length) ? acc + 1 : acc;
  }, 0);
};

const solution2 = (lines: Array<string>, signalMap: Array<string>): number => {
  let finalOutput: number = 0;

  for (let line of lines) {
    let letterMapping: { [id: string]: string } = {};
    const input: Array<string> = getLineInput(line);

    /* for a = missing letter between the 2 and 3 letter words */
    const inputsBySize: { [id: string]: Array<string> } = input.reduce(
      (acc, curr) => {
        acc[curr.length] = (acc[curr.length] || []).concat(curr);
        return acc;
      },
      {}
    );

    letterMapping["a"] = getDifference(
      inputsBySize["3"][0],
      inputsBySize["2"][0]
    )[0];

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
    const numAppearencesPerLetter: { [id: string]: number } = {};
    for (let inp of input) {
      for (let letter of inp.split("")) {
        if (letter === letterMapping["a"]) continue;
        numAppearencesPerLetter[letter] =
          (numAppearencesPerLetter[letter] || 0) + 1;
      }
    }

    for (let letter of Object.keys(numAppearencesPerLetter)) {
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
    let eighthSegment: string = inputsBySize["7"][0];
    for (let inp of inputsBySize["6"]) {
      let difference: Array<string> = getDifference(eighthSegment, inp);
      if (
        difference.length === 1 &&
        !Object.values(letterMapping).includes(difference[0])
      ) {
        letterMapping["d"] = difference[0];
        break;
      }
    }

    // g is the remaining letter
    let g: string = "abcdefg"
      .split("")
      .filter((x) => !Object.values(letterMapping).includes(x))[0];
    letterMapping["g"] = g;

    // Handle output calculation
    let transformedSignalMap: { [id: string]: number } = {};
    for (let i = 0; i < signalMap.length; i++) {
      transformedSignalMap[
        signalMap[i]
          .split("")
          .map((letter) => letterMapping[letter])
          .sort()
          .join("")
      ] = i;
    }

    const output = getLineOutput(line);
    finalOutput += parseInt(
      output
        .map((word) => transformedSignalMap[word.split("").sort().join("")])
        .join("")
    );
  }

  return finalOutput;
};

const main = (): void => {
  const lines: Array<string> = file;
  const signalMap: Array<string> = [
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
