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
                url: '/preQuiz/',                                       // set url
                templateUrl: 'routes/student/preQuiz/preQuiz.html',           // defines the HTML template
                controller: 'preQuizCtrl as vm'                              // this view shall use the ListCtrl previously declared.
            });
    }

    function preQuizCtrl($stateParams, $http, $state, $timeout, socket) {// our controller for this view
        var vm = this;
        console.log("warteraum");
        console.log($stateParams.id);
        socket.emit('joinQuiz', $stateParams.id);

        socket.on('joinedQuiz', function (quiz) {
            console.log('You just joined quiz ' + quiz);

        });
    }
})();