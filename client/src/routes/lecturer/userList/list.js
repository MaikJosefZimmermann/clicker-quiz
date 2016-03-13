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
                templateUrl: 'routes/lecturer/userList/list.html',           // defines the HTML template
                controller: 'ListCtrl as vm'                              // this view shall use the ListCtrl previously declared.
            });
    }

    function ListCtrl($scope, $state, $http) {                      // our controller for this view
        var vm = this;

        $http({                                                     // get all users from node server
            method: 'GET',
            url: '/api/users'
        }).then(function successCallback(response) {
            vm.users = response.data;                           // (async) when receive the response load the data into $scope.users
        });


        vm.goSingle = function (id) {                           // scope function which calls a single state
            console.log(id);
            $state.go('edit', {id: id});
        };

    }
})();
