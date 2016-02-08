(function () {
    'use strict';

    angular
        .module('app.list', [])                                     // creates new module
        .config(config)                                             // config function for our module app.list
        .controller('ListCtrl', ListCtrl);                          // bind ListCtrl to module


    function config($stateProvider) {                               // inject $stateProvider into config object
        $stateProvider
            .state('list', {                                        // declare list view
                url: '/list',                                       // set url
                templateUrl: 'routes/lecturer/list/list.html',           // defines the HTML template
                controller: 'ListCtrl'                              // this view shall use the ListCtrl previously declared.
            });
    }

    function ListCtrl($scope, $state, $http) {                      // our controller for this view

        $http({                                                     // get all users from node server
            method: 'GET',
            url: 'http:/api/api/users'
        }).then(function successCallback(response) {
            $scope.users = response.data;                           // (async) when receive the response load the data into $scope.users
        });


        $scope.goSingle = function (id) {                           // scope function which calls a single state
            $state.go('edit', {id: id});
        };

    }
})();
