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
                url: '/warteraum/:qname',                                       // set url
                templateUrl: 'routes/student/preQuiz/preQuiz.html',           // defines the HTML template
                controller: 'preQuizCtrl as vm'                              // this view shall use the ListCtrl previously declared.
            });
    }

    function preQuizCtrl($stateParams, $state, socket) {// our controller for this view
        var vm = this;
        vm.qname = $stateParams.qname;

        //   vm.quiz = $stateParams.currentQuiz;

        // socket.emit('joinQuiz', $stateParams.id, $localStorage);

        socket.on('startQuiz', function (id) {
            $state.go('quizSingleStudent', {id: id});
        });
        socket.on('message', function (id) {
            socket.emit('start', id);

        });

        socket.on('printTimeQuiz', function (time) {

            var min = time / 60;
            var sek = time % 60;
            var str = min.toString();
            str = str.substring(0, str.indexOf("."));
            vm.timeQuiz = str + " Minuten " + sek + " Sekunden ";

        });


        vm.test = function () {
            socket.emit('ttt');
        }
    }
})();