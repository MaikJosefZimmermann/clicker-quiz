'use strict';
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    port = process.env.PORT || 9000,
    auth = require('./app/routes/auth');

mongoose.connect('mongodb://localhost:27018/quiz');


app.use(bodyParser.json());
app.use(cors());
app.use('/api/quizes', require('./app/routes/quiz.js'));
app.use('/api/users', require('./app/routes/user.js'));
app.listen(port);

app.post('/auth', auth.login);
app.post('/logout', auth.logout);
/*Anfrage wird erst bearbeitet wenn request bearbeitet wird
 * anschließend gehts zur api*/
app.use([require('./app/middlewares/validateRequest')]);

console.log('Magic happens on port ' + port);


/*
 'use strict';

 var express = require('express');
 var app = express();
 var server = require('http').createServer(app);
 var io = require('socket.io')(server);
 var port = process.env.PORT || 9000;

 server.listen(port, function () {
 console.log('Server is running at port 9000');
 });

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
 if(socket.adapter.rooms[room]){
 console.log('es wird gewürfelt');
 io.to(room).emit('diceResults', dice());
 }else{
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

 socket.on('disconnect', function() {
 console.log('User disconnected from room');
 });
 });
 */


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