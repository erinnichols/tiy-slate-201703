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
let express = require('express');
let nunjucks = require('nunjucks');
let bodyParser = require('body-parser');

let app = express();
nunjucks.configure('templates', {
  autoescape: true,
  watch: true,
  express: app
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  console.log('a request went by', req.path);
  next(); // go to the next middleware
  // next('router'); // magic
  // next('view'); // more magic
});

app.use(function(req, res, next) {
  console.log(req.body);
  if (req.method == 'POST' && req.body['X-HTTP-METHOD'] && req.body['X-HTTP-METHOD'] === 'delete') {
    req.method = 'DELETE';
  }
  next();
});

app.use(function (err, req, res, next) {
  console.error('something bad happened', req.path, err);
  next(err);
});

app.get('/', function(req, res) {
  res.contentType('text/html');
  res.render('index.html', {
    games: globalGames
  });
});

app.get('/:gameIndex', function(req, res) {
  let gameIndex = Number(req.params.gameIndex);
  if (isNaN(gameIndex) || gameIndex >= globalGames.length || gameIndex < 0) {
    return res.redirect('/');
  }
  res.contentType('text/html');
  res.render('game.html', {
    index: gameIndex,
    game: globalGames[gameIndex]
  });
});

app.post('/create', function(req, res) {
  let game = new TicTacToeGame({
    humanFirst: Boolean(Math.floor(Math.random() * 2)),
    gameId: new Date().valueOf()
  });
  globalGames.push(game);
  saveGame(game);
  let gameIndex = globalGames.length - 1;
  res.redirect(`/${gameIndex}`);
});

app.post('/:gameIndex', function(req, res) {
  let gameIndex = req.params.gameIndex;
  let game = globalGames[gameIndex];
  let { row, col } = req.body;
  game.play(Number.parseInt(row), Number.parseInt(col));
  saveGame(game);
  if (game.isOver()) {
    return res.render('game.html', {
      game: game,
      index: gameIndex
    });
  }
  res.redirect(`/${gameIndex}`);
});

app.delete('/delete', function(req, res) {
  let gameIndex = Number.parseInt(req.body.gameIndex);
  let game = globalGames[gameIndex];
  // remove from globalGames
  globalGames.splice(gameIndex, 1);
  // delete the file
  fs.unlink(`./sandwich/${game.gameId}.json`);
  res.redirect('/');
});

function saveGame(game) {
  let data = game.toJSON();
  let fileName = `./sandwich/${game.gameId}.json`;
  fs.writeFile(fileName, data);
}

let globalGames;

readDir(fileDir)
  // .map(stuff => console.log(stuff))
  .map(fileName => readFile(`${fileDir}/${fileName}`, {encoding: 'utf-8'}))
  .map(json => TicTacToeGame.fromJSON(json))
  .then(gameList => {
    let port = process.env.PORT || 8080;
    globalGames = gameList;
    app.listen(port, () => console.log(`Listening on port ${port}`));
  })
  .catch(err => console.error(err));
