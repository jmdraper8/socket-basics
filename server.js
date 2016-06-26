var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

//Sends Current Users to provided socket
function sendCurrentUsers (socket) {
	var info = clientInfo[socket.id];
	var users = [];

	if (typeof info === 'undefined') {
		return;
	}

	Object.keys(clientInfo).forEach (function (socketId) {
		var userInfo = clientInfo[socketId];

		if (info.room === userInfo.room) {
			users.push(userInfo.name);
		}
	});

	socket.emit('message', {
		name: 'System',
		text: 'Current users: ' + users.join(', '),
		timestamp: moment().valueOf()
	});
}

//Add provate command

function sendPrivateMessage (message, socket) {
	var info = clientInfo[socket.id];
	var targetUser = (message.text.split(' '))[1];
	var users = [];

	if (typeof info === 'undefined') {
		return;
	}



	Object.keys(clientInfo).forEach (function (socketId) {
		var userInfo = clientInfo[socketId];

		if (info.room === userInfo.room) {
			users.push(userInfo.name);
			if (targetUser === userInfo.name) {
				if (io.sockets.connected[socketId]) {
    				io.sockets.connected[socketId].emit('message', {
    					name: message.name,
    					text: message.text.split(' ').slice(2).join(' '),
    					timestamp: moment().valueOf()
    				});
				}
			}
		}
	});

	// console.log((message.text.split(' '))[1]);
	// console.log(message.text.split(' ').slice(2).join(' '));
	// //console.log(socket);



}

io.on('connection', function (socket) {
	console.log('User connectiod via socket.io!');

	socket.on('disconnect', function () {

		var userData = clientInfo[socket.id];

		if (typeof userData !== 'undefined') {
			socket.leave(userData.room);
			io.to(userData.room).emit('message', {
				name: 'System',
				text: userData.name + ' has left the room!',
				timestamp: moment().valueOf()
			});
			delete clientInfo[socket.id];
		}
	});

	socket.on('joinRoom', function (req) {
		clientInfo[socket.id] = req; 
		socket.join(req.room);

		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: req.name + ' has joined!',
			timestamp: moment().valueOf()
		});
	});

	socket.on('message', function (message) {
		console.log('Message recieved: ' + message.text);

		if (message.text === '@currentUsers') {
			sendCurrentUsers(socket);
		} else if (message.text.startsWith('@private')) {
			sendPrivateMessage(message, socket);
		} else {
			message.timestamp = moment().valueOf();
			//io.emmit; will send the message to everyone including the sender
			io.to(clientInfo[socket.id].room).emit('message', message);
		}
	});

	socket.emit('message', {
		name: 'System',
		text: 'Welcome to the chat application!',
		timestamp: moment().valueOf()
	});
});

http.listen(PORT, function () {
	console.log('Server started on port: ' + PORT);
});