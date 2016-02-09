(function () {
    'use strict';

    angular
        .module('app.quizListLecturer', [])                                     // creates new module
        .config(config)
        .controller('qListLecturerCtrl', qListLecturerCtrl);                    // config function for our module app.list

    function config($stateProvider) {                               // inject $stateProvider into config object
        $stateProvider
            .state('quizListLecturer', {                                        // declare list view
                url: '/quizListLecturer',                                       // set url
                templateUrl: 'routes/quizListLecturer/quizListLecturer.html',           // defines the HTML template
                controller: 'qListLecturerCtrl'                              // this view shall use the ListCtrl previously declared.
            });
    }

    function qListLecturerCtrl($state, $http) {                      // our controller for this view
        var vm = this;

        $http({                                                     // get all users from node server
            method: 'GET',
            url: '/api/quizes'
        }).then(function successCallback(response) {
            vm.quizes = response.data;                           // (async) when receive the response load the data into $scope.users
        });


        vm.goQSingle = function (id) {                           // scope function which calls a single state
            $state.go('qedit', {id: id});
        };

    }
})();
