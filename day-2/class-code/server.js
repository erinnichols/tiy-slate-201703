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

function processFile(fileName) {
  return readFile(`./sandwich/${fileName}`, {encoding: 'utf-8'})
    .then(json => TicTacToeGame.fromJSON(json))
    .then(game => gameList.push(game))
    .catch(err => console.error(err));
}

readDir('./sandwich')
  // .map(stuff => console.log(stuff))
  .all(fileName => processFile(fileName))
  .then(() => console.log(gameList))
  .catch(err => console.error(err));

module.exports = gameList;
