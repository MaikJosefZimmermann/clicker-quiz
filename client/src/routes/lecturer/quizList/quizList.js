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
            url: '/api/questions'
        }).then(function successCallback(response) {
            vm.questions = response.data;                           // (async) when receive the response load the data into $scope.users
            console.log("Fragen:" + vm.questions);
        });


        vm.goQSingle = function (id) {                           // scope function which calls a single state
            $state.go('qedit', {id: id});
        };

    }
})();
