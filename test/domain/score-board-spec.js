const ScoreBoard = require('../../domain/score-board');
const should = require('should');

describe('Scoreboard', function() {
  it('should store have two players after adding two players', function () {
    const scoreBoard = new ScoreBoard();

    const users = [
      {
        id: 1,
        name: 'Anne'
      },
      {
        id: 2,
        name: 'Bob'
      }
    ];

    scoreBoard.initialiseScoreBoard(users);

    scoreBoard.playersCount().should.be.equal(2)
  });

  it('should store score of player', function () {
    const playerNo = 1;
    const frameNo = 1;
    const bowlNo = 1;
    const score = 5;

    const scoreBoard = new ScoreBoard();

    const users = [
      {
        id: 1,
        name: 'Anne'
      },
      {
        id: 2,
        name: 'Bob'
      }
    ];

    scoreBoard.initialiseScoreBoard(users);
    scoreBoard.addScoreToPerson(playerNo, frameNo, bowlNo, score);
    scoreBoard.getScore(playerNo, frameNo, bowlNo).should.be.equal(score);
  });
});