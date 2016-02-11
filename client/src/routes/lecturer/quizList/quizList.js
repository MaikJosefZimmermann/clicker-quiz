(function () {
    'use strict';

    angular
        .module('app.quizList', [])                                     // creates new module
        .config(config)
        .controller('quizListCtrl', quizListCtrl);                    // config function for our module app.list

    function config($stateProvider) {                               // inject $stateProvider into config object
        $stateProvider
            .state('quizList', {                                        // declare list view
                url: '/quizList',                                       // set url
                templateUrl: 'routes/lecturer/quizList/quizList.html',           // defines the HTML template
                controller: 'quizListCtrl'                              // this view shall use the ListCtrl previously declared.
            });
    }

    function quizListCtrl($state, $http) {                      // our controller for this view
        var vm = this;

        $http({                                                     // get all users from node server
            method: 'GET',
            url: '/api/quizes'
        }).then(function successCallback(response) {
            vm.quizes = response.data;                           // (async) when receive the response load the data into $scope.users

        });

        vm.delete = function (id) {                           // declare a scope function ( which is also accessible from html template)

            $http({                                             // if button (single.html line 44) is clicked this function will send a DELETE request to our node server and passes the id
                method: 'DELETE',
                url: '/api/quizes/' + id
            }).then(function successCallback(response) {
                $state.go('quizList');                       // when the server responses we rediret to the list
            });
        };


        vm.goQSingle = function (id) {                           // scope function which calls a single state
            $state.go('qedit', {id: id});
        };

    }
})();
