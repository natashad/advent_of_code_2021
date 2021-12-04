/* Input Reading Functions */
const fs = require("fs");
const readline = require("readline");
const FILENAME = "input.txt";
const stream = fs.createReadStream(FILENAME);

const rl = readline.createInterface({
  input: stream,
  crlfDelay: Infinity,
});

let lines = [];

const readInput = new Promise((resolve) => {
  rl.on("line", (line) => lines.push(line.trim())).on("close", () =>
    resolve(lines)
  );
});
/* End Input Reading Functions */

const parseInput = (input) => {
  let bingoNumbers = input[0].split(",");
  let bingoCards = [[]];

  for (i = 2; i < input.length; i++) {
    if (input[i] === "") {
      bingoCards.push([]);
      continue;
    }
    bingoCards[bingoCards.length - 1].push(
      input[i].split(/\s+/).map((value) => [value, 0])
    );
  }

  return {
    numbers: bingoNumbers,
    cards: bingoCards,
  };
};

const checkWin = (bingoCards) => {
  const checkRow = (card) => {
    rowMarkedSum = row.reduce((prev, current) => prev + current[1], 0);
    if (rowMarkedSum === 5) {
      return true;
    }
    return false;
  };

  let winningCards = [];
  for ([index, card] of bingoCards.entries()) {
    for (row of card) {
      if (checkRow(row)) winningCards.push(index);
    }
    transposedCard = card[0].map((_, colIndex) =>
      card.map((row) => row[colIndex])
    );
    for (row of transposedCard) {
      if (checkRow(row)) winningCards.push(index);
    }
  }

  return [...new Set(winningCards)];
};

const markCard = (bingoCards, number) => {
  bingoCards.map((card) => {
    card.map((row) => {
      row.map((value) => {
        if (value[0] === number) {
          value[1] = 1;
        }
      });
    });
  });
};

const calculateScore = (bingoCard, winningNumber) => {
  score = card.reduce((rowAccumulator, rowCurrent) => {
    rowScore = rowCurrent.reduce(
      (accumulator, current) =>
        current[1] == 0 ? accumulator + parseInt(current[0]) : accumulator,
      0
    );
    return rowAccumulator + rowScore;
  }, 0);

  return score * winningNumber;
};

const solution1 = (input) => {
  let { numbers, cards } = parseInput(input);

  for (bingoNumber of numbers) {
    markCard(cards, bingoNumber);

    let winningCardIndices = checkWin(cards);

    if (winningCardIndices.length) {
      winningCardIndex = winningCardIndices[0];
      return calculateScore(cards[winningCardIndex], parseInt(bingoNumber));
    }
  }
};

const solution2 = (input) => {
  let { numbers, cards } = parseInput(input);

  for (bingoNumber of numbers) {
    markCard(cards, bingoNumber);

    let winningCardIndices = checkWin(cards);
    let winningCard;

    if (winningCardIndices.length) {
      for (index of winningCardIndices.sort((a, b) => b - a)) {
        winner = cards[index];
        cards.splice(index, 1);
      }
    }

    if (cards.length == 0) {
      return calculateScore(winningCard, parseInt(bingoNumber));
    }
  }
};

const main = async () => {
  const input = await readInput;
  console.log(solution1(input));
  console.log(solution2(input));
};

main();
