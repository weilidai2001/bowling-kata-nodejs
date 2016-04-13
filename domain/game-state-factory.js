'use strict';

const GameStateFactory = {

  createGameState (scoreBoard, currentPlayerNo, currentFrameNo, currentBowlNo, currentScore){
    return {
      currentPlayerNo,
      currentFrameNo,
      currentBowlNo,
      currentScore,
      isFinalBowlInFrame: GameStateFactory._calculateIsFinalBowlInFrame(scoreBoard, currentPlayerNo, currentFrameNo, currentBowlNo, currentScore),
      isFinalPlayerInFrame: GameStateFactory._calculateIsFinalPlayerInFrame(scoreBoard, currentPlayerNo),
      isFinalFrame: GameStateFactory._calculateIsFinalFrame(currentFrameNo)
    }
  },

  _calculateIsFinalBowlInFrame(scoreBoard, currentPlayerNo, currentFrame, currentBowlNo, score) {
    const isLastFrame = currentFrame == 10;
    const isStrike = score == 10;

    if (!isLastFrame) {
      if (currentBowlNo == 1) {
        return isStrike;
      } else {
        return true;
      }

    } else { // last frame
      if (currentBowlNo == 2) {
        const Bowl1Score = scoreBoard.getScore(currentPlayerNo, currentFrame, 1);
        const Bowl2Score = score;

        return !(Bowl1Score == 10 || Bowl1Score + Bowl2Score == 10);
      }

      return true;
    }
  },

  _calculateIsFinalPlayerInFrame(scoreBoard, currentPlayerNo) {
    return currentPlayerNo == scoreBoard.playersCount();
  },

  _calculateIsFinalFrame(currentFrameNo) {
    return currentFrameNo == 10;
  }
};

module.exports = GameStateFactory;