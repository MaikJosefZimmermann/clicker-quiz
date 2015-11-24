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



    function LoginCtrl($scope, $state, $http) {                 // our controller for this view

        $scope.login = function () {                             // another scope function that will save a user object to our nodejs server
            $http({
                method: 'PUT',                                  // hint: learn http request verbs: get, put (change), delete
                data: $scope.user,                              // this passes the data from the user object  to the request.
                url: 'http://localhost:9000/api/users/' + $stateParams.id
            }).then(function successCallback(response) {
                $state.go('list');
            });
        }

        $http({                                                     // get all users from node server
            method: 'POST',
            url: 'http://localhost:9000/api/users'
        }).then(function successCallback(response) {
            $scope.users = response.data;                           // (async) when receive the response load the data into $scope.users
        });

    }
})();
