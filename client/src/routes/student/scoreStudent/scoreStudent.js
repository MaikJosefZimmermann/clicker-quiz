/**
 * Created by maikzimmermann on 11.02.16.
 */

(function () {
    'use strict';

    angular
        .module('app.scoreStudent', [])                                     // creates new module
        .config(config)                                             // config function for our module app.list
        .controller('scoreStudentCtrl', scoreStudentCtrl);                          // bind ListCtrl to module


    function config($stateProvider) {
        // inject $stateProvider into config object
        $stateProvider
            .state('scoreStudent', {                                        // declare list view
                url: '/scoreStudent/:id',                                       // set url
                templateUrl: 'routes/student/scoreStudent/scoreStudent.html',           // defines the HTML template
                controller: 'scoreStudentCtrl as vm'                              // this view shall use the ListCtrl previously declared.
            });
    }

    function scoreStudentCtrl($stateParams, $http, $state, $timeout, socket) {// our controller for this view
        var vm = this;
        $http({                                                 // http get requst to our api passing the id. this will load a specific user object
            method: 'GET',
            url: '/api/quizes/' + $stateParams.id
        }).then(function successCallback(response) {            // hint: async! when the data is fetched we do ..
            vm.quiz = response.data;                               // load the response data to the scope.user obj
            socket.emit('requestResult');
        });

        socket.on('UserReachedPoints', function (result) {
            console.log("UserReachedPoints");
            console.log(result);
            vm.UserReachedPoints = result;
        });
        socket.on('quizQuestionsLength', function (quizQuestionsLength) {
            console.log("quizQuestionsLength");
            console.log(quizQuestionsLength);
            vm.quizQuestionsLength = quizQuestionsLength;
        });

        socket.on('correctQuestions', function (result) {
            console.log("correctQuestions");
            console.log(result);
            vm.correctQuestions = result;
        });
        socket.on('falseQuestions', function (result) {
            console.log("falseQuestions");
            console.log(result);
            vm.falseQuestions = result;
        });




    }
})();