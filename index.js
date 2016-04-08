const express = require("express");
const app = express();

const stateMachine = require('./domain/state-machine');

const taskExecutor = {
  execute(res) {
    return task => {

      if(task.task == 'promptRegistration'){
        res.send({task: 'PromptRegistration'});
      }
    }
  }
};


var server = app.listen(8090, function () {

  app.get('/', function(req, res){
    const tasks = stateMachine.begin();

    tasks.forEach(taskExecutor.execute(res));
  });

});