(function () {
    'use strict';

    angular
        .module("app.login", [])                                     // creates new module
        .config(config)                                             // config function for our module app.list
        .controller('LoginCtrl', LoginCtrl);                          // bind ListCtrl to module


    function config($stateProvider) {                               // inject $stateProvider into config object
        $stateProvider
            .state('login', {                                        // declare list view
                url: "/login",                                       // set url
                templateUrl: 'routes/login/login.html',           // defines the HTML template
                controller: 'LoginCtrl'                              // this view shall use the ListCtrl previously declared.
            })
    }

    function LoginCtrl($scope, $state, $http) {                      // our controller for this view

        $http({                                                     // get all users from node server
            method: 'GET',
            url: 'http://localhost:9000/api/users'
        }).then(function successCallback(response) {
            $scope.users = response.data;                           // (async) when receive the response load the data into $scope.users
        });


        $scope.goSingle = function (id) {                           // scope function which calls a single state
            $state.go('edit', {id: id});
        };

    }
})();
