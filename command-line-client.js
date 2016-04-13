'use strict';

const readline = require('readline-sync');
const assert = require('assert');

const stateMachine = require('./domain/state-machine');
const ScoreBoard = require('./domain/score-board');
const GameStateFactory = require('./domain/game-state-factory');

const taskExecutor = {
  execute(scoreBoard) {
    return function (task) {
      if (task.task == 'promptRegistration') {
        var player1 = readline.question('Enter Player 1 name: ');
        var player2 = readline.question('Enter Player 2 name: ');

        const players = [
          {
            id: 1,
            name: player1
          },
          {
            id: 2,
            name: player2
          }
        ];

        stateMachine.registration(players).forEach(taskExecutor.execute(new ScoreBoard()));
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

        renderScoreBoard(context);

        const newScore = readline.question(`Enter score for ${context.playerName} on frame ${context.frameNo} for bowl ${context.bowlNo}: `);

        const gameState = GameStateFactory.createGameState(scoreBoard, context.playerNo, context.frameNo, context.bowlNo, newScore);

        stateMachine.enterPlayerScore(gameState).forEach(taskExecutor.execute(scoreBoard));
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

function renderScoreBoard(context) {
  console.log(`===== Scoreboard =====`);
  process.stdout.write('          '); // 10 padding spaces
  for (let frame in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    process.stdout.write(`  ${frame}  `)
  }

  console.log();
  process.stdout.write('----------'); // 10 padding "-"'s
  for (let frame in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    process.stdout.write(`-----`)
  }

  console.log();
  context.nameMapping.forEach(player => {
    process.stdout.write(player.name);
    process.stdout.write('|');
    for (let frame of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {

      process.stdout.write(`|`);

      if (context.scoreBoard[player.id] && context.scoreBoard[player.id][frame]) {
        process.stdout.write(`  ${context.scoreBoard[player.id][frame][1]} `);
        if (context.scoreBoard[player.id][frame][2]) {
          process.stdout.write(` | ${context.scoreBoard[player.id][frame][2]}  `);
        } else {
          process.stdout.write(` |  `);
        }
      } else {
        process.stdout.write(`  |  `)
      }

      process.stdout.write(`|`);
    }
    console.log();
  });
}

const tasks = stateMachine.begin();
tasks.forEach(taskExecutor.execute({}));



