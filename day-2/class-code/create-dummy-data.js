let TicTacToeGame = require('./src/tic-tac-toe-game');
let fs = require('fs');
let BBPromise = require('bluebird');

let mkdir = function(path) {
  return new Promise((good, bad) => {
    fs.mkdir(path, err => {
      if (err && err.code !== 'EEXIST') {
        return bad(err);
      }
      good();
    });
  });
};





let writeFile = BBPromise.promisify(fs.writeFile);
let makeDir = BBPromise.promisify(fs.mkdir);

function makeANewGame() {
  let game = new TicTacToeGame();
  game.play(1, 1);
  return game;
}

let promise = mkdir('./sandwich');
for (let i of [1, 2]) {
  promise = promise
    .then(() => makeANewGame())    // returns a new TicTacToeGame
    .then(game => game.toJSON())
    .then(json => {
      return {
        fileName: `./sandwich/${new Date().valueOf()}.json`,
        data: json
      };
    })
    .then(({ fileName, data }) => writeFile(fileName, data))
}
promise.catch(err => console.error(err));
