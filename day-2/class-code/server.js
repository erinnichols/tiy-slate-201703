/*
 Use promises to
 * read the sandwich directory
 * for each of the files, read the contents
 * objectify the contents into a module-level list of games
*/

let TicTacToeGame = require('./src/tic-tac-toe-game');
let fs = require('fs');
let Promise = require('bluebird');

let readDir = Promise.promisify(fs.readdir);
let readFile = Promise.promisify(fs.readFile);

let gameList = [];

readDir('./sandwich')
  .then(arr => {
    arr.forEach(fileName => {
      readFile(`./sandwich/${fileName}`)
        .then(json => TicTacToeGame.fromJSON(json))
        .then(game => gameList.push(game))
        .catch(err => console.error(err))
    });
  })
  .catch(err => console.error(err));

module.exports = gameList;
