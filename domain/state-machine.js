'use strict';
const StateMachine = {
  begin: () => {
    return [
      {
        task: 'promptRegistration'
      }
    ]
  },

  registration: users => {
    return [
      {
        task: 'initialiseScoreBoard',
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

  enterPlayerScore: (currentScoreBoard, currentPlayerId, currentPlayerFrame, currentBowlNo, score) => {
    if (nextPlayer){
      return [
        {
          task: 'promptPlayerEnterScore',
          player: 999,
          frame: 999,
          bowl: 999
        }
      ]
    }

    if (gameEnd) {
      return [
        {
          task: 'promptEndGame'
        }
      ]
    }

  }
};

module.exports = StateMachine;