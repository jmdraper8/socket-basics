var socket = io();

socket.on('connect', function () {
	console.log('Conected to socket.io server');
});