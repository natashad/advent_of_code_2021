const fs = require('fs')
const readline = require('readline');


const solution1 = async (filename) => {
  return new Promise((res) => {
    const stream = fs.createReadStream(filename);

    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity,
    });

    let previous;
    let totalIncreases = 0;

    rl.on('line', function(line) {

      current = parseInt(line);

      if (previous !== undefined) {
        if (current > previous) {
          totalIncreases++;
        }
      }

      previous = current;

    }).on('close', function() {
      res(totalIncreases);
    });
  });
}



const solution2 = async(filename) => {
  return new Promise((res) => {
    const stream = fs.createReadStream(filename);

    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity,
    });

    let a;
    let b;
    let c;
    let prev;
    let totalIncreases = 0;

    rl.on('line', function(line) {
      c = b;
      b = a;
      a = parseInt(line);

      if (a && b && c) {
        let current = a + b + c;
        if (prev) {
          if (current > prev) totalIncreases++;
        }
        prev = current
      }
    }).on('close', function() {
      res(totalIncreases);
    });
  })
}

const main = async () => {
  console.log(await solution1('input.txt'))
  console.log(await solution2('input.txt'))
};

main();