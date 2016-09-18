"use strict";
var database = require('./../database');
var MongoClient = require('mongodb').MongoClient
var assert = require('assert');
var date = require('../lib/date')
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/chat';

var Chat = (function(io, http){
	var io = io;
	var http = http;
	var public_init = function(members){
		if(members){
			var _name = data.name;
			var _messages = data.messages;
			console.log('existen miembros');
			}else{
				io.on('connection', function(socket){
				/*Suscripcion a una room*/
				socket.on('suscribe',function(room){
					console.log('participando del room ', room);
					socket.join(room);

					MongoClient.connect(url, function(err, db) {
						var collection = db.collection('messages').find({room: room}).sort({'current_time': 1})
						var messages = [];
							collection.each(function(err, doc) {
						      assert.equal(err, null);
						      if (doc != null) {
						      	console.log(doc.message);
						         messages.push({timestamp: doc.current_time, content: doc.message});
						      }else{
						      	/*Luego de llenar el objeto messages lo envio a la vista para que lo reenderice el objeto Chat*/  
						   		 io.sockets.in(room).emit('renderOldMessages', messages);
						      }
						   });
					})
				});

				/*Des-Suscripcion a una room*/

				socket.on('unsuscribe', function(room){
					socket.leave(room);
					console.log('se desuscribio del room ', room);
				});

				/*Manejo de mensajes enviados*/
				socket.on('sendMessage', function(data){
					var current_time = date.getDateTime();
				    
				    console.log(current_time);

					MongoClient.connect(url, function(err, db) {
						db.collection('messages').insertOne({
							message: data.msj,
							current_time: current_time,
							room: data.room
						}, function(err, result) {
						    console.log("Inserted a document into the messages collection.");
					     	db.close();	
					 	});


				    io.sockets.in(data.room).emit('sendMessageToFront', data.msj);

				    
					});/*url, function(*/

				}); /*'sendMessage', function(*/
			});/*io.on('conection'...*/

			}
			_runServerChat(3000);
		};

	var public_getNameChat = function(){
		return _name;
	};

	var public_getMessages = function(){
		return _messages;
	};

	var public_saveMessage = function(){
		var a = MongoClient.connect(database.url(), function(err, db) {
			assert.equal(err, null);
			console.log('conectado la sv');
			return true;
		});

		console.log('valor de a: ' + a);
	}


	var _runServerChat = function(puerto) {
    http.listen(puerto, function(){
        console.log('listening on *:' + puerto);
    });
	};
	return{
		init: public_init,
		getNameChat: public_getNameChat,
		getMessages: public_getMessages,
		saveMessage: public_saveMessage 
	}
})


module.exports = Chat;