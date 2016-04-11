'use strict';

const _ = require('lodash');

module.exports = class ScoreBoard {
  constructor(data){
    if (data){
      this.scoreBoard = data.scoreBoard;
      this.nameMapping = data.nameMapping;
    } else {
      this.scoreBoard = {};
      this.nameMapping = {};
    }
  }

  initialiseScoreBoard (users) {
    users.forEach(user => this.nameMapping[user.id] = user.name);

    this.scoreBoard = {};
  };

  playersCount () {
    return _.keys(this.nameMapping).length;
  };

  getScore (playerNo, frameNo, bowlNo) {
    return this.scoreBoard[playerNo][frameNo][bowlNo];
  };

  addScoreToPerson (playerNo, frameNo, bowlNo, score) {
    if (!this.scoreBoard[playerNo])
      this.scoreBoard[playerNo] = {};

    if (!this.scoreBoard[playerNo][frameNo])
      this.scoreBoard[playerNo][frameNo] = {};

    this.scoreBoard[playerNo][frameNo][bowlNo] = score;
  };

  getScoreBoard () {
    return this.scoreBoard;
  };

  getPlayers () {
    return _.map(this.nameMapping, (value, key) => ({id: key, name: value}));
  };

  getPlayerNameById (id) {
    return this.nameMapping[id];
  }

  serialise () {
    return {
      scoreBoard: this.scoreBoard,
      nameMapping: this.nameMapping
    };
  }
};