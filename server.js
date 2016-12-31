var socket  = require( './node_modules/socket.io' );
var express = require('./node_modules/express');
var app     = express();
var server  = require('http').createServer(app);
var io      = socket.listen( server );
var port    = process.env.PORT || 3000;
var users = [];

server.listen(port, function () {
  console.log('Server listening on port %d', port);
});

io.on('connection', function (socket) {
	socket.on('new user', function(name, callback){
		if(name.length > 0){
			if(users.indexOf(name) == -1){
				socket.username = name;
				users.push(socket.username);
				updateUsers();
				callback(true);
			} else{
				callback(false);
			}
		}
	});

	socket.on('new message', function(msg){
		var sender = socket.username;
		var message = msg;
		io.emit('push message', {name: sender, msg: message});
	});

	function updateUsers(){
	    io.emit('users', users);
	}

	socket.on('disconnect',function(){
		if(socket.username){
			users.splice(users.indexOf(socket.username),1);
			updateUsers();
		}
	});
});