'use strict';

module.exports = class GameState {

  constructor(scoreBoard, currentPlayerNo, currentFrameNo, currentBowlNo, currentScore) {
    this._currentPlayerNo = currentPlayerNo;
    this._currentFrameNo = currentFrameNo;
    this._currentBowlNo = currentBowlNo;
    this._currentScore = currentScore;

    this._isFinalBowlInFrame = GameState._calculateIsFinalBowlInFrame(scoreBoard, currentPlayerNo, currentFrameNo, currentBowlNo, currentScore);
    this._isFinalPlayerInFrame = GameState._calculateIsFinalPlayerInFrame(scoreBoard, currentPlayerNo);
    this._isFinalFrame = GameState._calculateIsFinalFrame(currentFrameNo)
  }

  get currentPlayerNo() {
    return this._currentPlayerNo;
  }

  get currentFrameNo() {
    return this._currentFrameNo;
  }

  get currentBowlNo() {
    return this._currentBowlNo;
  }

  get currentScore() {
    return this._currentScore;
  }

  static _calculateIsFinalBowlInFrame(scoreBoard, currentPlayerNo, currentFrame, currentBowlNo, score) {
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
  }

  static _calculateIsFinalPlayerInFrame(scoreBoard, currentPlayerNo) {
    return currentPlayerNo == scoreBoard.playersCount();
  }

  static _calculateIsFinalFrame(currentFrameNo) {
    return currentFrameNo == 10;
  }

  isFinalBowlInFrame() {
    return this._isFinalBowlInFrame;
  }

  isFinalPlayerInFrame() {
    return this._isFinalPlayerInFrame;
  }

  isFinalFrame() {
    return this._isFinalFrame;
  }
};