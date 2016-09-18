var express = require('express');
var app = express();
var http = require('http').Server(app);
var routes = require('./Controllers/routes');
var io = require('socket.io')(http);

/****Chat***/
var Chat = require('./models/chat');


var chat = new Chat(io,http);
chat.init();
/***********/

/*views*/
app.use(routes.home);
app.use(routes.chat);
/*******/





