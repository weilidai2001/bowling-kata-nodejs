const _ = require('lodash');

module.exports = function () {
  var scoreBoard = {};
  var nameMapping = {};

  this.initialiseScoreBoard = function (users) {
    users.forEach(user => nameMapping[user.id] = user.name);

    scoreBoard = {};
  };

  this.playersCount = function () {
    return _.keys(nameMapping).length;
  };

  this.getScore = function (playerNo, frameNo, bowlNo) {
    return scoreBoard[playerNo][frameNo][bowlNo];
  };

  this.addScoreToPerson = function (playerNo, frameNo, bowlNo, score) {
    if (!scoreBoard[playerNo])
      scoreBoard[playerNo] = {};

    if (!scoreBoard[playerNo][frameNo])
      scoreBoard[playerNo][frameNo] = {};

    scoreBoard[playerNo][frameNo][bowlNo] = score;
  };

  this.getScoreBoard = function () {
    return scoreBoard;
  };

  this.getPlayers = function() {
    return _.map(nameMapping, (value, key) => ({id: key, name: value}));
  };

  this.getPlayerNameById = function(id) {
    return nameMapping[id];
  }
};