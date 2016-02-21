/**
 * Created by maikzimmermann on 18.02.16.
 */
(function () {
    'use strict';

    angular
        .module('app.preQuiz', [])                                     // creates new module
        .config(config)                                             // config function for our module app.list
        .controller('preQuizCtrl', preQuizCtrl);                          // bind ListCtrl to module


    function config($stateProvider) {
        // inject $stateProvider into config object
        $stateProvider
            .state('preQuiz', {                                        // declare list view
                url: '/preQuiz/:id',                                       // set url
                templateUrl: 'routes/student/preQuiz/preQuiz.html',           // defines the HTML template
                controller: 'preQuizCtrl as vm'                              // this view shall use the ListCtrl previously declared.
            });
    }

    function preQuizCtrl($stateParams, $localStorage, $state, $timeout, socket) {// our controller for this view
        var vm = this;
        vm.id = $stateParams.id;
        console.log($localStorage.user);
        console.log("warteraum");
        socket.emit('joinQuiz', $stateParams.id, $localStorage);
        socket.on('joinedQuiz', function (quiz) {
            vm.quiz = quiz;
            console.log('You just joined quiz ' + quiz);

            console.log("Meine socketID " + socket.id);
        });
        socket.on('startQuiz', function (id) {
            $state.go('quizSingleStudent', {id: id});
        });
        socket.on('message', function (m) {
            console.log("in der message");
            console.log(m);
        });

        vm.goQuiz = function (id) {
            socket.emit('start', id);

        }
    }
})();