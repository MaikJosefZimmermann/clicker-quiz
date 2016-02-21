'use strict';
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    port = process.env.PORT || 9000,
    auth = require('./app/routes/auth'),
    server = require('http').createServer(app),
    io = require('socket.io')(server);
mongoose.connect('mongodb://localhost:27018/quiz');
var corsOptions = {
    "origin": "http://localhost:3000",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    credentials: true
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

server.listen(port, function () {
    console.log('Server is running at port 9000');
});
app.post('/api/auth', auth.login);
app.post('/api/logout', auth.logout);
/*Anfrage wird erst bearbeitet wenn request bearbeitet wird
 * anschließend gehts zur api*/
app.use([require('./app/middlewares/validateRequest')]);
//TODO hier kommen alle anwendungsrouten rein
app.use('/api/quizes', require('./app/routes/quiz.js'));
app.use('/api/users', require('./app/routes/user.js'));
app.use('/api/questions', require('./app/routes/question.js'));


console.log('Magic happens on port ' + port);


var Quiz = require('./app/models/quiz');
// Socket.io Funktionen

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 8000});

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        //     console.log('received: %s', message);
    });
    ws.send('something');
});

/**
 * Setup proxy
 * @type {*|exports|module.exports}
 */
var httpProxy = require('http-proxy');
var http = require('http');
var proxy = new httpProxy.createProxyServer({
    target: {
        host: 'localhost',
        port: 8000
    }
});




function getQuiz(quizId, callback) {


    Quiz.findById(quizId, function (err, quiz) {

        if (err) {
            return err;
        }

    }).then(function successCallback(response) {
        if (response) {

            callback(response);


        }

    });

}

function shuffle(array) {

    for (var j, x, i = array.length; i; j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
    return array;
}

io.on('connection', function (socket) {
    var quizData;
    var counter;
    var question;
    var timerStop = false;
    var result;
    var currentTime;
    var tid;


    console.log("Socket.io connection done");

    socket.on('answer', function (answer) {
        saveAnswer(answer);


        getQuestion();

    });
    socket.on('start', function (id) {
        startQuiz(id);

    });
    socket.on('requestQuiz', function (quizId) {


        getQuiz(quizId, function (currentQuiz) {

            counter = 0;
            sendQuiz(currentQuiz);
            quizData = currentQuiz;
            shuffle(quizData.questions);
            getQuestion();

        });
        function sendQuiz(currentQuiz) {
            socket.emit('printQuiz', currentQuiz);
        };

    });
    function saveAnswer(answer) {
        if (result == answer) {
            console.log("richtig");
            socket.emit('result', result = true);

        } else {
            console.log("falsch");
            socket.emit('result', result = false);
        }
    }
    function getQuestion() {
        if (counter < quizData.questions.length) {
            question = quizData.questions[counter];
            result = question.answer1;

            var answers = [question.answer1, question.answer2, question.answer3, question.answer4];
            shuffle(answers);
            var temp = shuffle(answers);

            if (temp) {

                question.answers = temp;
            }

            var currentQuestion = {
                question: question.question,
                answers: answers,
                points: question.points,
                time: question.time
            };
            countDown(question.time);
            sendQuestion(currentQuestion);
            counter++;
        } else {
            if (counter == quizData.questions.length) {
                console.log("Quiz fertig");
                socket.emit('endQuiz');
                timerStop = true;
                //countDown(0);
            }
        }

    }


    function startQuiz(quizId) {
        socket.emit('startQuiz', quizId);

    };


    socket.on('checkQuizPassword', function (id, password) {
        var vm = this;
        vm.loginerr = false;
        console.log(password);
        getQuiz(id, function (currentQuiz) {
            var quizzz = new Quiz;
            console.log("QQQQQQQQQQQQQQQQQ:");
            console.log(quizzz);
            quizzz.qname = currentQuiz.qname;
            quizzz.questions = currentQuiz.questions;

            console.log("QQQ befüllt:");
            console.log(quizzz);
            if (currentQuiz.key == password || currentQuiz.key === '') {
                console.log("correkt");
                socket.emit('waitingRoom', currentQuiz.id);
            } else {
                socket.emit('passwordFalse');
            }
        })

    });

    function countDown(time) {
        timerStop = false;
        abortTimer();
        // time = 20;
        currentTime = time;

        tid = setTimeout(decrease, 1000);

        // set timeout


        function decrease() {
            if (currentTime == 0 || timerStop == true) {

                socket.emit('printTime', currentTime);
                saveAnswer(null);
                abortTimer();
                getQuestion();
                console.log("STOP");
            } else {
                socket.emit('printTime', currentTime);
                currentTime--;


                tid = setTimeout(decrease, 1000);
            }

            console.log(currentTime);

            // do some stuff...
            // repeat myself
        }
        function abortTimer() { // to be called when you want to stop the timer
            clearTimeout(tid);
        }

    }


    function sendQuestion(question) {

        socket.emit('printQuestion', question);
        socket.emit('printTime', question.time);
    }

    socket.on('joinQuiz', function (quizId, currentUser) {
        console.log('User will ins Quiz' + quizId);
        console.log("user: ");
        console.log(currentUser);
        getQuiz(quizId, function (currentQuiz) {

            if (currentQuiz) {
                socket.join(quizId);
                var rooms = io.sockets.adapter.rooms;
                console.log("alle räume: ");
                console.log(rooms);
                var clientNumber = io.sockets.adapter.rooms[quizId];

                console.log("clientNumber im quiz: ");
                console.log(clientNumber);
                console.log("eigene ID: ");
                console.log(socket.id);
                console.log("aktuelle quizID: ");
                console.log(quizId);
                console.log("übereinstimmung mit 56c0b3a21f392f262721d26a")


                console.log('User ist im Quiz ' + quizId);
                socket.emit('joinedQuiz', currentQuiz.qname);
                socket.to(quizId).emit('message', 'Willkommen im Quiz');
            } else {
                console.log('error: Quiz gibt es nicht');
            }

        });


    });
    socket.on('disconnect', function () {
        console.log('Socket.io connection disconnect');
    })
});
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