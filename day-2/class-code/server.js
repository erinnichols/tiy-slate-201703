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
const fileDir = './sandwich'

module.exports = readDir(fileDir)
  // .map(stuff => console.log(stuff))
  .map(fileName => readFile(`${fileDir}/${fileName}`, {encoding: 'utf-8'}))
  .map(json => TicTacToeGame.fromJSON(json))
  .then(gameList => console.log(gameList))
  .catch(err => console.error(err))
