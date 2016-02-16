'use strict';

var express = require('express');
var app = express();
var router = express.Router();
var server = require('http').createServer(app);
var socket = require('socket.io')(server);
var io = socket.listen(server);

module.exports = function (io) {

    io.sockets.on('connection', function (socket) {

        socket.on('captain', function (data) {

            console.log(data);

            socket.emit('america');
        });
    });
};

io.sockets.on('connection', function (socket) {
    console.log('client connected!');
});

router.use(function (req, res, next) {
    console.log('Incoming API request.', req.body);
    next();
});

router.route('/')

function getRooms() {
    return [
        'IT-Advanced',
        'Informatik'
    ];
}

function dice() {
    return (Math.random());
}

io.on('connection', function (socket) {
    console.log(socket);

    socket.on('requestRooms', function () {
        socket.emit('printRooms', getRooms());
    });

    socket.on('doDice', function (room) {
        if (socket.adapter.rooms[room]) {
            console.log('es wird gewürfelt');
            io.to(room).emit('diceResults', dice());
        } else {
            console.log('User nicht im Raum');
        }

    });

    socket.on('joinRoom', function (room) {
        console.log('User will in den Raum' + room);

        if (getRooms().indexOf(room) > -1) {
            socket.join(room);
            console.log('User ist im Raum' + room);
            socket.emit('joinedRoom', room);
        }
        else {
            console.log('error: Raum gibt es nicht');
        }
    });

    socket.on('disconnect', function () {
        console.log('User disconnected from room');
    });
});

module.exports = router;

/* cheat sheet

 // sending to sender-client only
 socket.emit('message', "this is a test");

 // sending to all clients, include sender
 io.emit('message', "this is a test");

 // sending to all clients except sender
 socket.broadcast.emit('message', "this is a test");

 // sending to all clients in 'game' room(channel) except sender
 socket.broadcast.to('game').emit('message', 'nice game');

 // sending to all clients in 'game' room(channel), include sender
 io.in('game').emit('message', 'cool game');

 // sending to sender client, only if they are in 'game' room(channel)
 socket.to('game').emit('message', 'enjoy the game');

 // sending to all clients in namespace 'myNamespace', include sender
 io.of('myNamespace').emit('message', 'gg');

 // sending to individual socketid
 socket.broadcast.to(socketid).emit('message', 'for your eyes only');

 */