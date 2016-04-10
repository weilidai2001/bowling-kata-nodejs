const _ = require('lodash');
const nunjucks = require('nunjucks');
const express = require("express");
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser());

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

const stateMachine = require('./domain/state-machine');
const ScoreBoard = require('./domain/score-board');

const scoreBoard = new ScoreBoard();

const taskExecutor = {
  execute(res) {
    return function(task) {
      if (task.task == 'promptRegistration') {
        res.render('registration.html');
      }

      if (task.task == 'addUsersToScoreBoard') {
        scoreBoard.initialiseScoreBoard(task.users);
      }

      if (task.task == 'promptPlayerEnterScore') {
        const context = {
          playerNo: task.player,
          frameNo: task.frame,
          bowlNo: task.bowl,
          scoreBoard: scoreBoard.getScoreBoard(),
          nameMapping: scoreBoard.getPlayers(),
          playerName: scoreBoard.getPlayerNameById(task.player)
        };

        res.render('player-enter-score.html', context);
      }

      if (task.task == 'updateScoreBoard') {
        scoreBoard.addScoreToPerson(
          task.player,
          task.frame,
          task.bowl,
          task.score
        )
      }
    }
  }
};


var server = app.listen(8090, function () {

  app.get('/', function (req, res) {
    const tasks = stateMachine.begin();

    tasks.forEach(taskExecutor.execute(res));
  });

  app.post('/registration', function(req, res){
    const users = _.map(req.body, (value, key) => ({id: key, name: value})).filter(x => x.name);

    const tasks = stateMachine.registration(users);

    tasks.forEach(taskExecutor.execute(res));
  });

  app.post('/score/:player/:frame/:bowl', function (req, res) {
    const player = parseInt(req.params.player);
    const frame = parseInt(req.params.frame);
    const bowl = parseInt(req.params.bowl);
    const score = parseInt(req.body.score);

    const tasks = stateMachine.enterPlayerScore(scoreBoard, player, frame, bowl, score);

    tasks.forEach(taskExecutor.execute(res));
  });

});