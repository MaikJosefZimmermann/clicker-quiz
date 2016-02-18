/**
 * Created by maikzimmermann on 11.02.16.
 */

(function () {
    'use strict';

    angular
        .module('app.quizSingleStudent', [])                                     // creates new module
        .config(config)                                             // config function for our module app.list
        .controller('startCtrl', startCtrl);                          // bind ListCtrl to module


    function config($stateProvider) {
        // inject $stateProvider into config object
        $stateProvider
            .state('quizSingleStudent', {                                        // declare list view
                url: '/quizSingleStudent/:id',                                       // set url
                templateUrl: 'routes/student/quizSingleStudent/quizSingleStudent.html',           // defines the HTML template
                controller: 'startCtrl as vm'                              // this view shall use the ListCtrl previously declared.
            });
    }

    function startCtrl($stateParams, $http, $state, $timeout, socket) {// our controller for this view
        var vm = this;
        var quizData;
        vm._id = 0;
        console.log("startCtrl");
        vm.quizSingleStudent = true;

        socket.emit('requestQuiz', $stateParams.id);


        socket.on('printQuiz', function (quiz) {
            console.log(quiz);
            // vm.rooms = rooms;
            vm.quiz = quiz;
            quizData = vm.quiz.questions;
            // getQuestion();

        });

        socket.on('printTime', function (time) {
            console.log(time);
            var min = time / 60;
            var sek = time % 60;
            var str = min.toString();
            str = str.substring(0, str.indexOf("."));
            //  vm.countDown = str + " Minuten " + sek + " Sekunden ";
            vm.time = str + " Minuten " + sek + " Sekunden ";


        });

        socket.on('printQuestion', function (question) {
            // console.log(quiz);
            // vm.rooms = rooms;
            vm.question = question;
            //quizData = vm.quiz.questions;


        });


        //  console.log($stateParams);


        //TODO Anworten zufällig rausgeben




        function checkAnswer() {
            console.log('CHECK');
            //TODO richtige Antwort finden
        }

        vm.answerButton = function (answer) {
            console.log(answer);
            socket.emit('answer', answer);
        };


    }
})();