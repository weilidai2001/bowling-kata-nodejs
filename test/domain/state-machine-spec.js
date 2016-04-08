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

    it('should prompt for next player if current player scores a strike on a non-final frame', function() {
      const playerNo = 1;
      const frameNo = 1;
      const bowlNo = 1;
      const score = 10;

      const stubScoreBoard = {
        playersCount(){
          return 2;
        }
      };

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
          player: 2,
          frame: frameNo,
          bowl: 1
        }
      ];

      const tasks = stateMachine.enterPlayerScore(stubScoreBoard, playerNo, frameNo, bowlNo, score);

      tasks.should.be.eql(expectedTasks);
    });

    it('should prompt for next player after second bowl on first frame', function() {
      const playerNo = 1;
      const frameNo = 1;
      const bowlNo = 2;
      const score = 5;

      const stubScoreBoard = {
        playersCount(){
          return 2;
        }
      };

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

      const tasks = stateMachine.enterPlayerScore(stubScoreBoard, playerNo, frameNo, bowlNo, score);

      tasks.should.be.eql(expectedTasks);
    });

    it('should prompt for new frame and player 1 after the last player has bowled the second bowl', function() {
      const playerNo = 2;
      const frameNo = 1;
      const bowlNo = 2;
      const score = 5;

      const stubScoreBoard = {
        playersCount(){
          return 2;
        }
      };

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

      const tasks = stateMachine.enterPlayerScore(stubScoreBoard, playerNo, frameNo, bowlNo, score);

      tasks.should.be.eql(expectedTasks);
    });

    it('should prompt for third bowl on final frame if player previously scored a strike', function() {
      const playerNo = 1;
      const frameNo = 10; // final frame
      const bowlNo = 2;
      const score = 5;

      const stubScoreBoard = {
        playersCount(){
          return 2;
        },
        getScore(){
          return 10; // first bowl was a strike
        }
      };

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
          bowl: 3 // 3rd bowl
        }
      ];

      const tasks = stateMachine.enterPlayerScore(stubScoreBoard, playerNo, frameNo, bowlNo, score);

      tasks.should.be.eql(expectedTasks);
    });

    it('should prompt for third bowl on final frame if player scored a spare', function() {
      const playerNo = 1;
      const frameNo = 10;
      const bowlNo = 2;
      const score = 5;

      const stubScoreBoard = {
        playersCount(){
          return 2;
        },
        getScore(){
          return 5; // first bowl + second bowl = 10 which is a spare
        }
      };

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
          frame: frameNo,
          bowl: 3
        }
      ];

      const tasks = stateMachine.enterPlayerScore(stubScoreBoard, playerNo, frameNo, bowlNo, score);

      tasks.should.be.eql(expectedTasks);
    });

    it('should NOT prompt for third bowl on final frame if player scored less than 10', function() {
      const playerNo = 1;
      const frameNo = 10;
      const bowlNo = 2;
      const score = 0;

      const stubScoreBoard = {
        playersCount(){
          return 2;
        },
        getScore(){
          return 5; // first bowl + second bowl < 10
        }
      };

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

      const tasks = stateMachine.enterPlayerScore(stubScoreBoard, playerNo, frameNo, bowlNo, score);

      tasks.should.be.eql(expectedTasks);
    });
  });
});