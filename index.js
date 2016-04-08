const express = require("express");
const app = express();

var server = app.listen(8090, function () {
  app.get('/', function(req, res){
    
    
    res.send({status: 'OK'});
  });
});