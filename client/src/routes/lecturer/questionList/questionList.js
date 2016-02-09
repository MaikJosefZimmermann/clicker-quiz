(function () {
    'use strict';

    angular
        .module('app.questionList', [])                                     // creates new module
        .config(config)                                             // config function for our module app.list
        .controller('qListCtrl', qListCtrl);                          // bind ListCtrl to module


    function config($stateProvider) {                               // inject $stateProvider into config object
        $stateProvider
            .state('questionList', {                                        // declare list view
                url: '/questionList',                                       // set url
                templateUrl: 'routes/lecturer/questionList/questionList.html',           // defines the HTML template
                controller: 'qListCtrl'                              // this view shall use the ListCtrl previously declared.
            });
    }

    function qListCtrl($scope, $state, $http) {                      // our controller for this view

        $http({                                                     // get all users from node server
            method: 'GET',
            url: 'http://localhost:9000/api/quizes'
        }).then(function successCallback(response) {
            $scope.quizes = response.data;                           // (async) when receive the response load the data into $scope.users
        });


        $scope.goQSingle = function (id) {                           // scope function which calls a single state
            $state.go('qedit', {id: id});
        };

    };
})();
