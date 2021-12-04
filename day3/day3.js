const fs = require("fs");
const readline = require("readline");

const solution1 = async (filename) => {
  return new Promise((res) => {
    const stream = fs.createReadStream(filename);

    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity,
    });

    let lines = [];

    rl.on("line", function (line) {
      lines.push(line);
    }).on("close", function () {
      let gamma = "";
      let epsilon = "";

      for (i = 0; i < lines[0].length; i++) {
        let colResult = lines
          .map((el) => el[i])
          .reduce(
            (prev, current) => {
              prev[current]++;
              return prev;
            },
            [0, 0]
          );
        gamma += colResult[0] > colResult[1] ? 0 : 1;
        epsilon += colResult[0] < colResult[1] ? 0 : 1;
      }

      gamma = parseInt(gamma, 2);
      epsilon = parseInt(epsilon, 2);

      res(gamma * epsilon);
    });
  });
};

const solution2 = async (filename) => {
  const diagnosticsParser = (lines, isOxygen) => {
    const numCols = lines[0].length;

    for (i = 0; i < numCols; i++) {
      let colResult = lines
        .map((el) => el[i])
        .reduce(
          (prev, current) => {
            prev[current]++;
            return prev;
          },
          [0, 0]
        );

      if (isOxygen) {
        leadingBit = colResult[0] > colResult[1] ? "0" : "1";
      } else {
        leadingBit = colResult[0] <= colResult[1] ? "0" : "1";
      }

      lines = lines.filter((l) => l[i] === leadingBit);

      if (lines.length == 1) {
        return lines[0];
      }
    }
  };

  return new Promise((res) => {
    const stream = fs.createReadStream(filename);

    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity,
    });

    let lines = [];

    rl.on("line", function (line) {
      lines.push(line);
    }).on("close", function () {
      const oxygenGeneratorRating = parseInt(diagnosticsParser(lines, true), 2);
      const co2ScrubberRating = parseInt(diagnosticsParser(lines, false), 2);

      res(oxygenGeneratorRating * co2ScrubberRating);
    });
  });
};

const main = async () => {
  console.log(await solution1("input.txt"));
  console.log(await solution2("input.txt"));
};

main();
