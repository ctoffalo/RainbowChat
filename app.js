var express = require('express');
var app = express();
var http = require('http').Server(app);
var routes = require('./Controllers/routes');

/*views*/
app.use(routes.home);
app.use(routes.chat);
/*******/


var runServerChat = function(puerto) {
    http.listen(puerto, function(){
        console.log('listening on *:' + puerto);
    });
};

runServerChat(3000);

