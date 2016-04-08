const express = require("express");
const app = express();

const stateMachine = require('./domain/state-machine');
const ScoreBoard = require('./domain/score-board');

const scoreBoard = new ScoreBoard();

const taskExecutor = {
  execute(res, task) {

    if (task.task == 'promptRegistration') {
      res.send({task: 'PromptRegistration'});
    }

    if (task.task == 'addUsersToScoreBoard') {
      scoreBoard.addUsers(task.users);
    }

    if (task.task == 'promptPlayerEnterScore') {
      res.send({task: 'promptPlayerEnterScore'});
    }

    if (task.task == 'updateScoreBoard') {
      scoreBoard.updateScoreBoard(
        task.player,
        task.frame,
        task.bowl,
        task.score
      )
    }

  }
};


var server = app.listen(8090, function () {

  app.get('/', function (req, res) {
    const tasks = stateMachine.begin();

    tasks.forEach(task => taskExecutor.execute(res, task));
  });

  app.post('/score/:player/:frame/:bowl', function (req, res) {
    const player = 1;
    const frame = 1;
    const bowl = 1;
    const score = 5;

    const tasks = stateMachine.enterPlayerScore(scoreBoard, player, frame, bowl, score);

    tasks.forEach(task => taskExecutor.execute(res, task));
  });

});