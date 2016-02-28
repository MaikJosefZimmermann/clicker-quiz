'use strict';
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    port = process.env.PORT || 9000,
    auth = require('./app/routes/auth'),
    server = require('http').createServer(app),
//    io = require('socket.io')(server);
// use this to run socket.io in /api subdirectory
    io = require('socket.io').listen(server, {path: '/api/socket.io'});
mongoose.connect('mongodb://localhost:27018/quiz');
var corsOptions = {
    "origin": "http://localhost:3000",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    credentials: true
};
var socketioJwt = require("socketio-jwt");
io.use(socketioJwt.authorize({
    secret: 'acff95d7cb2dasdb22bd90e90c01',
    handshake: true
}));


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


var Quiz = require('./app/models/quiz'),
    Answer = require('./app/models/answer');

// Socket.io Funktionen

// Fragen / Antworten mischen
function shuffle(array) {

    for (var j, x, i = array.length; i; j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
    return array;
}

io.on('connection', function (socket) {


    var quizData,
        counter,
        timerStop = false,
        correct,
        result,
        currentTime,
        tid,
        currentQuiz = new Quiz,
        answ,
        currentUser = socket.decoded_token;

    console.log(currentUser.username);


    socket.on('auth', function (user) {
        // currentUser = user;
    });

    console.log("Socket.io connection done");


    socket.on('joinQuiz', function (quiz) {
        console.log("JOINQUIZ");

        currentQuiz = quiz;
        var moment = require('moment');
        var quizTime = moment(new Date(quiz.myDate));
        var currentTime = moment();
        //Differenz bis zum QuizStart
        var diffTime =  quizTime.diff(currentTime, 'seconds');
        var now = moment().toDate(); var calendar = moment().calendar();
        var verifiedStart = quiz.verifiedStart;
        var quizStart;


        // Einschreibeschlüssel und eigener Schlüssel gleich?
        if (currentQuiz.key === quiz.password) {

            // Zeit bis zum Quizbeginn < 5 Min
            if (diffTime <=300 && diffTime >=0) {

                socket.join(quiz._id);
                var rooms = io.sockets.adapter.rooms;
                console.log("alle räume: ");
                console.log(rooms);
                countdownQuiz(diffTime);

                // User in Warteraum schicken
                socket.emit('waitingRoom', currentQuiz.qname);

                //socket.emit('joinedQuiz', currentQuiz.qname);

            //  Wenn Quiz kein Startzeitpunkt hat
            }else if(verifiedStart == true) {

                socket.join(quiz._id);
                var rooms = io.sockets.adapter.rooms;

                adhocStart(quizStart);

                // User in Warteraum schicken
                socket.emit('waitingRoom', currentQuiz.qname);

            } else {
                if (diffTime < 0) {
                    console.log("Startzeitpunkt verpasst")
                }
                console.log("Anmeldung nicht möglich")
            }


        } else {

            socket.emit('passwordFalse');
        }

        socket.on('ttt', function () {
            console.log("TTTTTT");
            io.to(quiz._id).emit('message');
            // socket.to(quiz._id).emit('message');


        });


    });

    socket.on('answer', function (answer, question, user) {

        saveAnswer(answer, question, user);
        nextQuestion();



    });
    socket.on('start', function (id) {
        console.log("START");
        socket.emit('startQuiz', id);
    });


    socket.on('getQuizzes', function () {
        Quiz.find(function (err, quizes) {
            if (err) {
                res.send(err);
            }

            socket.emit('printQuizzes', quizes);
        });

    });


    socket.on('requestQuiz', function () {

        counter = 0;
        socket.emit('printQuiz', currentQuiz);
            quizData = currentQuiz;
            shuffle(quizData.questions);


        });


    function saveAnswer(ans, ques, user) {

        var questionName = ques.question,
            questionPoints;

        if (correct === ans) {
            console.log("richtig");
            socket.emit('result', result = true);
            questionPoints = ques.points;
        } else {
            console.log("falsch");
            socket.emit('result', result = false);
            questionPoints = 0;
        }

        var a = new Answer({
            question: questionName,
            answer: ans,
            result: result,
            userId: String,
            kurzel: user,
            quizId: currentQuiz._id,
            points: questionPoints,
            delete: Boolean
            //time: Date
        });

        //Answer.update(a);


        answ = a;

        a.save(function (err, a) {

            if (err) return console.error(err);
            console.dir(a);
        });

        return answ;
    }


    //---------------------------------------//
    //---------------Student-----------------//
    //---------------------------------------//
    socket.on('requestStudentResult', function (id) {
        console.log("im Socket requestLecturerResult");
        /*Answer.find({ quizId: id }, function(err, answers) {
         if (err) return console.error(err);
         console.log("!!!!!!!!!!!");
         console.dir(answers);
         return answers
         });*/
        var quizId = currentQuiz._id;


        //Summe der erreichten Punkte des Studenten
        Answer.aggregate([
            {
                $match: {
                    quizId: quizId,
                    kurzel: currentUser.username
                }
            },
            {
                $group: {
                    _id: "quizId",
                    sumPoints: {$sum: "$points"}
                }
            }
        ], function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            result = result[0].sumPoints;
            socket.emit('UserReachedPoints', result);
        });

        //alle richtigen Antworten des Studenten
        Answer.find({"quizId": quizId, "kurzel": currentUser.username, "result": "true"},
            function (err, result) {
                if (err) {
                    return console.error(err);

                }
                result = result.length;
                socket.emit('correctQuestions', result);
            });

        //alle falschen Antworten des Studenten
        Answer.find({"quizId": quizId, "kurzel": currentUser.username, "result": "false"},
            function (err, result) {
                if (err) {
                    return console.error(err);
                }
                result = result.length;
                socket.emit('falseQuestions', result);
            });

        //Anzahl der Fragen im Quiz
        var quiz = currentQuiz;
        console.log("vm.quiz");
        socket.emit('quizResult', quiz);


    });

    //---------------------------------------//
    //---------------Dozent------------------//
    //---------------------------------------//
    socket.on('requestLecturerResults', function (quizId) {
        console.log("im Socket requestLecturerResults");
        var id = quizId;
        //Summe der maximal erreichbaren Punkte in einem Quiz
        Answer.aggregate([
            {
                $match: {
                    quizId: id

                }
            },
            {
                $group: {
                    _id: "quizId",
                    maxPoints: {$sum: "$points"}
                }
            }
        ], function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("RESULT");
            console.log(result);
            socket.emit('maxPoints', result);
        });

        //Anzahl der Teilnehmer in einem Quiz
        Answer.distinct("kurzel", {quizId: id}, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("RESULT");
            console.log(result);
            socket.emit('users', result);
        });

    });

    socket.on('nextQuestion', function () {
        nextQuestion();
    });
    function nextQuestion() {

        if (counter < currentQuiz.questions.length) {
            var question = currentQuiz.questions[counter];
            correct = question.answer1;

            var answers = [question.answer1, question.answer2, question.answer3, question.answer4];
            shuffle(answers);
            question.answers = shuffle(answers);

            var currentQuestion = {
                question: question.question,
                answers: answers,
                points: question.points,
                time: question.time
            };
            countdown(question.time);
            socket.emit('printQuestion', currentQuestion);
            socket.emit('printTime', question.time);
            counter++;
        } else {
            if (counter === currentQuiz.questions.length) {
                console.log("Quiz fertig");
                socket.emit('endQuiz');
                timerStop = true;
                //countDown(0);
            }
        }
    }

    socket.on('test', function (id) {
        io.to(id).emit('message', id);
    });

    /**
     * Countdown im Quiz für Frage
     * @param time
     */
    function countdown(time) {

        timerStop = false;
        currentTime = time;


        tid = setInterval(decrease, 1000);



        function decrease() {
            if (currentTime === 0) {
                clearInterval(tid);
                nextQuestion();

            }
            if (timerStop === true) {

                socket.emit('printTime', currentTime);
                //  saveAnswer(null);
                console.log("STOP");
            }

            else {
                socket.emit('printTime', currentTime);
                currentTime--;

        }

            console.log(currentTime);


        }

    }

    /**
     * Countdown Quizbeginn im Warteraum
     * @param time
     * @param id
     */
    function countdownQuiz(time, id) {

        timerStop = false;
        abortTimer();

        tid = setTimeout(decrease, 1000);

        // set timeout

        socket.emit('printTimeQuiz', time);

        function decrease() {
            if (time === 0) {
                timerStop = true;

            }
            if (timerStop === true) {
                socket.emit('startQuiz', id);
                socket.emit('printTimeQuiz', time);
                //  saveAnswer(null);
                abortTimer();
                console.log("STOP");
            } else {
                socket.emit('printTimeQuiz', time);
                time--;


                tid = setTimeout(decrease, 1000);
            }

            console.log(time);

            // do some stuff...
            // repeat myself
        }

        function abortTimer() { // to be called when you want to stop the timer
            clearTimeout(tid);
        }

    }


    /**
     * Quiz Start Adhoc
     * @param id
     * TODO startfunktion adhoc
     */
    function adhocStart(quizStart, id) {
        console.log("quizstart in function adhoc: "+quizStart);
        console.log(socket.id);

        if (quizStart == true) {
            // socket um quiz zu starten
            socket.emit('startQuiz', id);
            console.log("quiz startet");
        }else {
            console.log("quiz kann nicht gestartet werden");
        }
        // socket um Zeit zu zeigen
        //socket.emit('printTimeQuiz', currentTime);

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