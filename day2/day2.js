const fs = require('fs')
const readline = require('readline');

const solution1 = async (filename) => {
  return new Promise((res) => {
    const stream = fs.createReadStream(filename);

    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity,
    });

    let horizontal = 0;
    let depth = 0;

    rl.on('line', function(line) {

      let [direction, value] = line.split(' ');
      value = parseInt(value);

      switch(direction) {
        case 'forward':
          horizontal += value;
          break
        case 'up':
          depth -= value;
          break;
        case 'down':
          depth += value;
          break;
      }
    }).on('close', function() {
      res(horizontal*depth);
    });
  });
};

const solution2 = async (filename) => {
  return new Promise((res) => {
    const stream = fs.createReadStream(filename);

    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity,
    });

    let horizontal = 0;
    let aim = 0;
    let depth = 0;

    rl.on('line', function(line) {

      let [direction, value] = line.split(' ');
      value = parseInt(value);

      switch(direction) {
        case 'forward':
          horizontal += value;
          depth += (aim * value);
          break
        case 'up':
          aim -= value;
          break;
        case 'down':
          aim += value;
          break;
      }
    }).on('close', function() {
      res(horizontal*depth);
    });
  });
};

const main = async () => {
  console.log(await solution1('input.txt'))
  console.log(await solution2('input.txt'))
}

main();
