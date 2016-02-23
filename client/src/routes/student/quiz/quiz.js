(function () {
    'use strict';

    angular
        .module('app.quiz', [])                                     // creates new module
        .config(config)                                             // config function for our module app.list
        .controller('QuizCtrl', QuizCtrl);                          // bind ListCtrl to module


    function config($stateProvider) {                               // inject $stateProvider into config object
        $stateProvider
            .state('quiz', {                                        // declare list view
                url: '/quiz',                                       // set url
                templateUrl: 'routes/student/quiz/quiz.html',           // defines the HTML template
                controller: 'QuizCtrl as vm'                              // this view shall use the ListCtrl previously declared.
            });
    }


    function QuizCtrl($state, socket, $localStorage) {// our controller for this view
        var vm = this;

        socket.emit('getQuizzes');
        socket.on('printQuizzes', function (quizzes) {
            vm.quizes = quizzes;
        });


        vm.goQuiz = function (quiz) {
            socket.emit('joinQuiz', quiz, $localStorage);
            socket.on('waitingRoom', function (qname) {


                $state.go('preQuiz', {qname: qname});
            });
            socket.on('passwordFalse', function () {
                vm.loginerr = true;
                console.log("Falsches Passwort");
            });

        };

    }
})();
