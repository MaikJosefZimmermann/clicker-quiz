(function () {
    'use strict';

    angular
        .module("app.quiz", [])                                     // creates new module
        .config(config)                                             // config function for our module app.list
        .controller('QuizCtrl', QuizCtrl);                          // bind ListCtrl to module


    function config($stateProvider) {                               // inject $stateProvider into config object
        $stateProvider
            .state('quiz', {                                        // declare list view
                url: "/quiz",                                       // set url
                templateUrl: 'routes/quiz/quiz.html',           // defines the HTML template
                controller: 'QuizCtrl as Ctrl'                              // this view shall use the ListCtrl previously declared.
            })
    }


    function QuizCtrl() {// our controller for this view

        var vm = this;
        var a0 = 'antwort1', a1 = 'antwort2', a2 = 'antwort3', a3 = 'antwort4';
        var q0 = 'frage1'


        vm.question = q0;

        vm.answers = [
            {'id': 0, answer: a0},
            {'id': 1, answer: a1},
            {'id': 2, answer: a2},
            {'id': 3, answer: a3}

        ];

        vm.ant = ant;

        function ant() {
var q5 = 'testsssssssssss';
            console.log('test1');

            vm.question=q1;
            console.log(vm.question);

        }


        /*$scope.answer = function (btn) {


         $scope.frage = btn;
         if (btn == '0') {
         $scope.frage = 'a=0';
         }
         if (btn == '1') {
         $scope.frage = 'a=1';
         }

         if (a == '2') {
         $scope.frage = 'ok';
         }

         }*/
    }
})();
