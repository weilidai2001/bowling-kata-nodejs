const stateMachine = require('../../domain/state-machine');
const should = require('should');

describe('State Machine', function() {
  describe('Game playing', function() {
    it('should prompt for same player to bowl again after first bowl on first frame', function() {
      const playerNo = 1;
      const frameNo = 1;
      const bowlNo = 1;
      const score = 5;

      const expectedTasks = [
        {
          task: 'updateScoreBoard',
          player: playerNo,
          frame: frameNo,
          bowl: bowlNo,
          score: score
        },
        {
          task: 'promptPlayerEnterScore',
          player: playerNo,
          frame: frameNo,
          bowl: bowlNo + 1
        }
      ];

      const tasks = stateMachine.enterPlayerScore(null, playerNo, frameNo, bowlNo, score);

      tasks.should.be.eql(expectedTasks);
    });

    it('should prompt for next player after second bowl on first frame', function() {
      const playerNo = 1;
      const frameNo = 1;
      const bowlNo = 2;
      const score = 5;

      const expectedTasks = [
        {
          task: 'updateScoreBoard',
          player: playerNo,
          frame: frameNo,
          bowl: bowlNo,
          score: score
        },
        {
          task: 'promptPlayerEnterScore',
          player: playerNo + 1,
          frame: frameNo,
          bowl: 1
        }
      ];

      const tasks = stateMachine.enterPlayerScore(null, playerNo, frameNo, bowlNo, score);

      tasks.should.be.eql(expectedTasks);
    });


    it('should prompt for new frame and player 1 after the last player has bowled the second bowl', function() {
      const playerNo = 2;
      const frameNo = 1;
      const bowlNo = 2;
      const score = 5;

      const expectedTasks = [
        {
          task: 'updateScoreBoard',
          player: playerNo,
          frame: frameNo,
          bowl: bowlNo,
          score: score
        },
        {
          task: 'promptPlayerEnterScore',
          player: 1,
          frame: frameNo + 1,
          bowl: 1
        }
      ];

      const tasks = stateMachine.enterPlayerScore(null, playerNo, frameNo, bowlNo, score);

      tasks.should.be.eql(expectedTasks);
    });
  });
});