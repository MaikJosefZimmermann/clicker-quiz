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

        socket.emit('joinQuiz', $stateParams.id);
        socket.emit('requestQuiz', $stateParams.id);



        socket.on('printQuiz', function (quiz) {
            vm.quiz = quiz;
            quizData = vm.quiz.questions;
        });


        function join(room) {
            console.log(room);
            socket.emit('joinRoom', room);
        }

        socket.on('endQuiz', function () {
            console.log("END");
            $state.go('quiz');
        });

        socket.on('printTime', function (time) {

            var min = time / 60;
            var sek = time % 60;
            var str = min.toString();
            str = str.substring(0, str.indexOf("."));
            vm.time = str + " Minuten " + sek + " Sekunden ";


        });

        socket.on('printQuestion', function (question) {

            vm.question = question;
        });

        socket.on('result', function (result) {

            if (result == true) {
                vm.result = "RICHTIG";
            } else {
                vm.result = "FALSCH";
            }


        });



        vm.answerButton = function (answer) {
            console.log(answer);
            socket.emit('answer', answer);
        };


    }
})();