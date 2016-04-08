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

  enterPlayerScore (scoreBoard, currentPlayerNo, currentFrame, currentBowlNo, score) {
    const isFinalBowlInFrame = (scoreBoard, currentFrame, currentBowlNo, score) => {
      const isLastFrame = currentFrame == 10;
      const isStrike = score == 10;
      
      if (!isLastFrame){
        if (currentBowlNo == 1){
          return isStrike;
        } else {
          return true;
        }
      
      } else { // last frame
        if (currentBowlNo == 2){
          const Bowl1Score = scoreBoard.getScore(currentPlayerNo, currentFrame, 1);
          const Bowl2Score = score;
          
          return !!(Bowl1Score == 10 || Bowl1Score + Bowl2Score == 10);
        }
        
        return true;
      }
    };
    
    const isFinalPlayerInFrame = (scoreBoard, currentPlayerNo) => currentPlayerNo == scoreBoard.playersCount();

    const isFinalFrame = currentFrame => currentFrame == 10;

    if (!isFinalBowlInFrame(scoreBoard, currentFrame, currentBowlNo, score)) {
      return [
        {
          task: 'updateScoreBoard',
          player: currentPlayerNo,
          frame: currentFrame,
          bowl: currentBowlNo,
          score: score
        },
        {
          task: 'promptPlayerEnterScore',
          player: currentPlayerNo,
          frame: currentFrame,
          bowl: currentBowlNo + 1
        }
      ]
    }

    if (!isFinalPlayerInFrame(scoreBoard, currentPlayerNo)) {
      return [
        {
          task: 'updateScoreBoard',
          player: currentPlayerNo,
          frame: currentFrame,
          bowl: currentBowlNo,
          score: score
        },
        {
          task: 'promptPlayerEnterScore',
          player: currentPlayerNo + 1,
          frame: currentFrame,
          bowl: 1 // reset bowl
        }
      ]
    }

    if (!isFinalFrame(currentFrame)) {
      return [
        {
          task: 'updateScoreBoard',
          player: currentPlayerNo,
          frame: currentFrame,
          bowl: currentBowlNo,
          score: score
        },
        {
          task: 'promptPlayerEnterScore',
          player: 1, // restart at player 1
          frame: currentFrame + 1,
          bowl: 1 // reset bowl
        }
      ]
    }

    return [
      {
        task: 'updateScoreBoard',
        player: currentPlayerNo,
        frame: currentFrame,
        bowl: currentBowlNo,
        score: score
      },
      {
        task: 'promptEndGame'
      }
    ]
  }
};

module.exports = StateMachine;