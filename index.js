const _ = require('lodash');
const nunjucks = require('nunjucks');
const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const assert = require('assert');

const app = express();
app.use(cookieParser());
app.use(bodyParser());

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

const stateMachine = require('./domain/state-machine');
const ScoreBoard = require('./domain/score-board');

const taskExecutor = {
  execute(res, scoreBoard) {
    return function (task) {
      if (task.task == 'promptRegistration') {
        res.render('registration.html');
      }

      if (task.task == 'addUsersToScoreBoard') {
        assert('users' in task, `'users' not in task`);

        scoreBoard.initialiseScoreBoard(task.users);
      }

      if (task.task == 'promptPlayerEnterScore') {
        assert('player' in task, `'player' not in task`);
        assert('frame' in task, `'frameNo' not in task`);
        assert('bowl' in task, `'bowlNo' not in task`);

        const context = {
          playerNo: task.player,
          frameNo: task.frame,
          bowlNo: task.bowl,
          scoreBoard: scoreBoard.getScoreBoard(),
          nameMapping: scoreBoard.getPlayers(),
          playerName: scoreBoard.getPlayerNameById(task.player)
        };

        res.cookie('score_board', scoreBoard.serialise());

        res.render('player-enter-score.html', context);
      }

      if (task.task == 'updateScoreBoard') {
        assert('player' in task, `'player' not in task`);
        assert('frame' in task, `'frame' not in task`);
        assert('bowl' in task, `'bowl' not in task`);
        assert('score' in task, `'score' not in task`);

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

  app.post('/registration', function (req, res) {
    const users = _.map(req.body, (value, key) => ({id: key, name: value})).filter(x => x.name);

    const scoreBoard = new ScoreBoard();

    const tasks = stateMachine.registration(users);

    tasks.forEach(taskExecutor.execute(res, scoreBoard));
  });

  app.post('/score/:player/:frame/:bowl', function (req, res) {
    const scoreBoardData = req.cookies.score_board;

    const player = parseInt(req.params.player);
    const frame = parseInt(req.params.frame);
    const bowl = parseInt(req.params.bowl);
    const score = parseInt(req.body.score);

    const scoreBoard = new ScoreBoard(scoreBoardData);

    const tasks = stateMachine.enterPlayerScore(scoreBoard, player, frame, bowl, score);

    tasks.forEach(taskExecutor.execute(res, scoreBoard));
  });

});