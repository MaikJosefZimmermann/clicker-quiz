/**
 * Created by maikzimmermann on 18.02.16.
 */

(function () {
    'use strict';

    angular
        .module('app.scoreSingle', [])                                     // creates new module
        .config(config)                                             // config function for our module app.list
        .controller('scoreSingleCtrl', scoreSingleCtrl);                          // bind ListCtrl to module


    function config($stateProvider) {
        // inject $stateProvider into config object
        $stateProvider
            .state('scoreSingle', {                                        // declare list view
                url: '/scoreSingle/:id',                                       // set url
                templateUrl: 'routes/lecturer/scoreSingle/scoreSingle.html',           // defines the HTML template
                controller: 'scoreSingleCtrl as vm'                              // this view shall use the ListCtrl previously declared.
            });
    }

    function scoreSingleCtrl($stateParams, $http, $state, $timeout, socket) {// our controller for this view
        var vm = this;
        $http({                                                 // http get requst to our api passing the id. this will load a specific user object
            method: 'GET',
            url: '/api/quizes/' + $stateParams.id
        }).then(function successCallback(response) {            // hint: async! when the data is fetched we do ..
            vm.quiz = response.data;                               // load the response data to the scope.user obj
            console.log(vm.quiz);
            socket.emit('requestLecturerResults', vm.quiz);
        });

        socket.on('maxPoints', function (result) {
            console.log("maxPoints");
            console.log(result);
            vm.maxPoints = result;

        });
        socket.on('users', function (result) {
         console.log("users");
         console.log(result);
         vm.users = result;

        });

    }
})();