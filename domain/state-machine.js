'use strict';
const StateMachine = {
  begin () {
    return [
      {
        task: 'promptRegistration'
      }
    ]
  },

  registration (users) {
    return [
      {
        task: 'addUsersToScoreBoard',
        users: users
      },
      {
        task: 'promptPlayerEnterScore',
        player: 1,
        frame: 1,
        bowl: 1
      }
    ]
  },

  enterPlayerScore (gameState) {
    if (!gameState.isFinalBowlInFrame) {
      return [
        {
          task: 'updateScoreBoard',
          player: gameState.currentPlayerNo,
          frame: gameState.currentFrameNo,
          bowl: gameState.currentBowlNo,
          score: gameState.currentScore
        },
        {
          task: 'promptPlayerEnterScore',
          player: gameState.currentPlayerNo,
          frame: gameState.currentFrameNo,
          bowl: gameState.currentBowlNo + 1
        }
      ]
    }

    if (!gameState.isFinalPlayerInFrame) {
      return [
        {
          task: 'updateScoreBoard',
          player: gameState.currentPlayerNo,
          frame: gameState.currentFrameNo,
          bowl: gameState.currentBowlNo,
          score: gameState.currentScore
        },
        {
          task: 'promptPlayerEnterScore',
          player: gameState.currentPlayerNo + 1,
          frame: gameState.currentFrameNo,
          bowl: 1 // reset bowl
        }
      ]
    }

    if (!gameState.isFinalFrame) {
      return [
        {
          task: 'updateScoreBoard',
          player: gameState.currentPlayerNo,
          frame: gameState.currentFrameNo,
          bowl: gameState.currentBowlNo,
          score: gameState.currentScore
        },
        {
          task: 'promptPlayerEnterScore',
          player: 1, // restart at player 1
          frame: gameState.currentFrameNo + 1,
          bowl: 1 // reset bowl
        }
      ]
    }

    return [
      {
        task: 'updateScoreBoard',
        player: gameState.currentPlayerNo,
        frame: gameState.currentFrameNo,
        bowl: gameState.currentBowlNo,
        score: gameState.currentScore
      },
      {
        task: 'promptEndGame'
      }
    ]
  }
};

module.exports = StateMachine;