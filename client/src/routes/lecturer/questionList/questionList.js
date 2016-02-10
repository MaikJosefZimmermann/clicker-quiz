(function () {
    'use strict';

    angular
        .module('app.questionList', [])                                     // creates new module
        .config(config)                                             // config function for our module app.list
        .controller('questionListCtrl', questionListCtrl);                          // bind ListCtrl to module


    function config($stateProvider) {                               // inject $stateProvider into config object
        $stateProvider
            .state('questionList', {                                        // declare list view
                url: '/questionList',                                       // set url
                templateUrl: 'routes/lecturer/questionList/questionList.html',           // defines the HTML template
                controller: 'questionListCtrl'                              // this view shall use the ListCtrl previously declared.
            });
    }

    function questionListCtrl($scope, $state, $http) {                      // our controller for this view

        $http({                                                     // get all users from node server
            method: 'GET',
            url: '/api/questions'
        }).then(function successCallback(response) {
            $scope.questions = response.data;                           // (async) when receive the response load the data into $scope.users
        });

        //TODO Delete funktion
        $scope.delete = function (id) {                           // declare a scope function ( which is also accessible from html template)
            console.log(id);
            console.log("Delete funktion");
            $http({                                             // if button (single.html line 44) is clicked this function will send a DELETE request to our node server and passes the id
                method: 'DELETE',
                url: '/api/questions/' + id
            }).then(function successCallback(response) {
                $state.go('questionList');                       // when the server responses we rediret to the list
            });
        };




        $scope.goQSingle = function (id) {                           // scope function which calls a single state
            $state.go('questionedit', {id: id});
        };

    };
})();
