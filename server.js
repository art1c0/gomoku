var app = require('express')(),
	express = require('express'),
	server = require('http').Server(app),
	io = require('socket.io')(server),
	path = __dirname + '/build',
	port = 3000,
	roomPrefix = '_room_';

app.use(express.static(path));

var emitRooms = function() {
	var rooms = {};
	for (var i in io.sockets.adapter.rooms) {
		if (i.indexOf(roomPrefix) === 0) rooms[i.replace(roomPrefix, '')] = io.sockets.adapter.rooms[i];
	}
	io.emit('rooms', rooms);
};

io.on('connection', function(socket) {
	emitRooms();
	
	socket.on('state', (room, state) => {
		io.to(roomPrefix + room).emit('state', state);
	});
	
	socket.on('create', room => {
		socket.join(roomPrefix + room);
		io.to(roomPrefix + room).emit('create', room);
		emitRooms();
	});
	
	socket.on('join', (room, player) => {
		socket.join(roomPrefix + room);
		io.to(roomPrefix + room).emit('join', room, player);
		emitRooms();
	});
	
	socket.on('leave', (room, player) => {
		socket.leave(roomPrefix + room);
		io.to(roomPrefix + room).emit('leave', room, player);
		emitRooms();
	});
});

server.listen(process.env.PORT || port);
console.log('Ready...')