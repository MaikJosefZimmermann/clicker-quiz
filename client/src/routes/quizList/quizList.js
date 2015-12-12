(function () {
    'use strict';

    angular
        .module("app.quizList", [])                                     // creates new module
        .config(config)                                             // config function for our module app.list
        .controller('CreateCtrl', CreateCtrl);                          // bind ListCtrl to module


    function config($stateProvider) {                               // inject $stateProvider into config object
        $stateProvider
            .state('quizList', {                                        // declare list view
                url: "/quizList",                                       // set url
                templateUrl: 'routes/quizList/quizList.html',           // defines the HTML template
                controller: 'CreateCtrl as cq'                              // this view shall use the ListCtrl previously declared.
            })
    }

    function CreateCtrl($scope, $state, $http) {                      // our controller for this view

        $http({                                                     // get all users from node server
            method: 'GET',
            url: 'http://localhost:9000/api/users'
        }).then(function successCallback(response) {
            $scope.users = response.data;                           // (async) when receive the response load the data into $scope.users
        });


        $scope.goSingle = function (id) {                           // scope function which calls a single state
            $state.go('qedit', {id: id});
        };

    }
})();
