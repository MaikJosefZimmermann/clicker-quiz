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

    function startCtrl($stateParams, $http, $state, $timeout) {                      // our controller for this view
        var vm = this;
        vm._id = 0;

        vm.quizSingleStudent = true;
        console.log($stateParams);
        var quizData;


        $http({                                                     // get all users from node server
            method: 'GET',
            url: '/api/quizes/' + $stateParams.id
        }).then(function successCallback(response) {
            vm.quiz = response.data;
            quizData = vm.quiz.questions;
            getQuestion();
            //TODO Anworten zufällig rausgeben

        });

        function getQuestion() {
            if (vm._id < quizData.length) {
                vm.quizData = quizData[vm._id];
                countDown(vm.quizData);
            } else {
                alert('Das Quiz ist zuende');
                $state.go('quiz');
            }

        }

        function getNextQuestion() {
            console.log('nexQ');
            vm._id++;
            getQuestion();
        }


        function checkAnswer() {
            console.log('CHECK');
            //TODO richtige Antwort finden
        }

        vm.answerButton = function () {
            checkAnswer();
            getNextQuestion();
        };

        function countDown(question) {
            var time = question.time;
            var count = function () {
                if (time === 0) {
                    getNextQuestion();
                } else {
                    vm.countDown = time;
                    var min = time / 60;
                    var sek = time % 60;
                    var str = min.toString();
                    str = str.substring(0, str.indexOf("."));
                    vm.countDown = str + " Minuten " + sek + " Sekunden ";
                    time--;
                    $timeout(count, 1000);

                }
            };
            count();
        }

        function stopCount() {
            $timeout.cancel();
            console.log("keine ahnung wie ich count zurücksetze");
        }


    }
})();