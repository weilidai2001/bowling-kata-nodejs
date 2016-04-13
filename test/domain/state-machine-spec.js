const stateMachine = require('../../domain/state-machine');
const should = require('should');

describe('State Machine', function () {
  describe('Game playing', function () {
    it('should prompt for same player to bowl again if first bowl and not strike', function () {
      const currentPlayerNo = 1;
      const currentFrameNo = 1;
      const currentBowlNo = 1;
      const currentScore = 5;

      const isFinalBowlInFrame = false;
      const isFinalPlayerInFrame = false;
      const isFinalFrame = false;

      const stubGameState = {
        currentPlayerNo: currentPlayerNo,
        currentFrameNo: currentFrameNo,
        currentBowlNo: currentBowlNo,
        currentScore: currentScore,
        isFinalBowlInFrame: isFinalBowlInFrame,
        isFinalPlayerInFrame: isFinalPlayerInFrame,
        isFinalFrame: isFinalFrame
      };

      const expectedTasks = [
        {
          task: 'updateScoreBoard',
          player: currentPlayerNo,
          frame: currentFrameNo,
          bowl: currentBowlNo,
          score: currentScore
        },
        {
          task: 'promptPlayerEnterScore',
          player: currentPlayerNo,
          frame: currentFrameNo,
          bowl: currentBowlNo + 1
        }
      ];

      const tasks = stateMachine.enterPlayerScore(stubGameState);

      tasks.should.be.eql(expectedTasks);
    });

    it('should prompt for next player if current player scores a strike on a non-final frame', function () {
      const playerNo = 1;
      const frameNo = 1;
      const bowlNo = 1;
      const score = 10;

      const isFinalBowlInFrame = true;
      const isFinalPlayerInFrame = false;
      const isFinalFrame = false;

      const stubGameState = {
        currentPlayerNo: playerNo,
        currentFrameNo: frameNo,
        currentBowlNo: bowlNo,
        currentScore: score,
        isFinalBowlInFrame: isFinalBowlInFrame,
        isFinalPlayerInFrame: isFinalPlayerInFrame,
        isFinalFrame: isFinalFrame
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

      const tasks = stateMachine.enterPlayerScore(stubGameState);

      tasks.should.be.eql(expectedTasks);
    });

    it('should prompt for next player after final bowl', function () {
      const playerNo = 1;
      const frameNo = 1;
      const bowlNo = 2;
      const score = 5;
      const isFinalBowlInFrame = true;
      const isFinalPlayerInFrame = false;
      const isFinalFrame = false;

      const stubGameState = {
        currentPlayerNo: playerNo,
        currentFrameNo: frameNo,
        currentBowlNo: bowlNo,
        currentScore: score,
        isFinalBowlInFrame: isFinalBowlInFrame,
        isFinalPlayerInFrame: isFinalPlayerInFrame,
        isFinalFrame: isFinalFrame
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

      const tasks = stateMachine.enterPlayerScore(stubGameState);

      tasks.should.be.eql(expectedTasks);
    });

    it('should prompt for new frame and next player after the last player in current frame has bowled the last bowl', function () {
      const playerNo = 2;
      const frameNo = 1;
      const bowlNo = 2;
      const score = 5;

      const isFinalBowlInFrame = true;
      const isFinalPlayerInFrame = true;
      const isFinalFrame = false;

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

      const stubGameState = {
        currentPlayerNo: playerNo,
        currentFrameNo: frameNo,
        currentBowlNo: bowlNo,
        currentScore: score,
        isFinalBowlInFrame: isFinalBowlInFrame,
        isFinalPlayerInFrame: isFinalPlayerInFrame,
        isFinalFrame: isFinalFrame
      };

      const tasks = stateMachine.enterPlayerScore(stubGameState);

      tasks.should.be.eql(expectedTasks);
    });

    it('should prompt for third bowl on final frame if player previously scored a strike', function () {
      const playerNo = 1;
      const frameNo = 10; // final frame
      const bowlNo = 2;
      const score = 5;

      const isFinalBowlInFrame = false;
      const isFinalPlayerInFrame = false;
      const isFinalFrame = false;

      const stubGameState = {
        currentPlayerNo: playerNo,
        currentFrameNo: frameNo,
        currentBowlNo: bowlNo,
        currentScore: score,
        isFinalBowlInFrame: isFinalBowlInFrame,
        isFinalPlayerInFrame: isFinalPlayerInFrame,
        isFinalFrame: isFinalFrame
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

      const tasks = stateMachine.enterPlayerScore(stubGameState);

      tasks.should.be.eql(expectedTasks);
    });

    it('should prompt for third bowl on final frame if player scored a spare', function () {
      const playerNo = 1;
      const frameNo = 10;
      const bowlNo = 2;
      const score = 5;

      const isFinalBowlInFrame = false;
      const isFinalPlayerInFrame = false;
      const isFinalFrame = true;

      const stubGameState = {
        currentPlayerNo: playerNo,
        currentFrameNo: frameNo,
        currentBowlNo: bowlNo,
        currentScore: score,
        isFinalBowlInFrame: isFinalBowlInFrame,
        isFinalPlayerInFrame: isFinalPlayerInFrame,
        isFinalFrame: isFinalFrame
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

      const tasks = stateMachine.enterPlayerScore(stubGameState);

      tasks.should.be.eql(expectedTasks);
    });

    it('should NOT prompt for third bowl on final frame if player scored less than 10', function () {
      const playerNo = 1;
      const frameNo = 10;
      const bowlNo = 2;
      const score = 0;

      const isFinalBowlInFrame = true;
      const isFinalPlayerInFrame = false;
      const isFinalFrame = true;

      const stubGameState = {
        currentPlayerNo: playerNo,
        currentFrameNo: frameNo,
        currentBowlNo: bowlNo,
        currentScore: score,
        isFinalBowlInFrame: isFinalBowlInFrame,
        isFinalPlayerInFrame: isFinalPlayerInFrame,
        isFinalFrame: isFinalFrame
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

      const tasks = stateMachine.enterPlayerScore(stubGameState);

      tasks.should.be.eql(expectedTasks);
    });

    it('should prompt end game after final player has bowled for the final time on the final frame', function () {
      const playerNo = 2;
      const frameNo = 10;
      const bowlNo = 2;
      const score = 0;

      const isFinalBowlInFrame = true;
      const isFinalPlayerInFrame = true;
      const isFinalFrame = true;

      const stubGameState = {
        currentPlayerNo: playerNo,
        currentFrameNo: frameNo,
        currentBowlNo: bowlNo,
        currentScore: score,
        isFinalBowlInFrame: isFinalBowlInFrame,
        isFinalPlayerInFrame: isFinalPlayerInFrame,
        isFinalFrame: isFinalFrame
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
          task: 'promptEndGame'
        }
      ];

      const tasks = stateMachine.enterPlayerScore(stubGameState);

      tasks.should.be.eql(expectedTasks);
    });
  });
});