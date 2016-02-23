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

    socket.on('answer', function (answer, quiz) {
        console.log(quiz);
        //  saveAnswer(answer);
        // console.log(answer);
        // console.log("question");
        // console.log(question);


        getQuestion();

    });
    socket.on('start', function (id) {
        startQuiz(id);


    });


    socket.on('getQuizzes', function () {
        Quiz.find(function (err, quizes) {
            if (err) {
                res.send(err);
            }
            console.log(quizes);
            socket.emit('printQuizzes', quizes);
        });

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


    socket.on('joinQuiz', function (quizz, currentUser) {


        getQuiz(quizz._id, function (quiz) {
            var currentQuiz = new Quiz;
            // console.log("QQQQQQQQQQQQQQQQQ:");
            //console.log(currentQuiz);
            //console.log(currentUser);
            currentQuiz.qname = quiz.qname;
            currentQuiz.questions = quiz.questions;
            //console.log("QQQ befüllt:");
            // console.log(currentQuiz);
            console.log("password");
            console.log(quizz.password);
            console.log("richtiges pw");
            console.log(quiz.key);

            if (quiz.key == quizz.password) {
                console.log("in der IF");
                socket.join(quiz._id);
                var rooms = io.sockets.adapter.rooms;
                console.log("alle räume: ");
                console.log(rooms);
                // var clientNumber = io.sockets.adapter.rooms[quizId];
                //  console.log("ClientNumbers from currentRoom");
                //  console.log(clientNumber);


                console.log("eigene socketID: ");
                console.log(socket.id);
                console.log('User ist im Quiz ' + quiz._id);
                // User in Warteraum schicken
                socket.emit('waitingRoom', currentQuiz.qname);

                //socket.emit('joinedQuiz', currentQuiz.qname);



            } else {

                socket.emit('passwordFalse');
            }

            socket.on('ttt', function () {
                console.log("TTTTTT");
                io.to(quiz._id).emit('message');
                // socket.to(quiz._id).emit('message');


            });

        });




    });


    function sendQuestion(question) {

        socket.emit('printQuestion', question);
        socket.emit('printTime', question.time);
    }


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