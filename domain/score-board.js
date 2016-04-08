module.exports = function (){
  var playerRow;

  this.addUsers = function (userNames){
    playerRow = userNames.map(name => ({name: name, frames: []}))
  };

  this.playersCount = function() {
    return playerRow.length;
  };
  
  this.getScore = function() {
    
  };
  
  this.updateScoreBoard = function(player, frame, bowl, score){
    
  }
};