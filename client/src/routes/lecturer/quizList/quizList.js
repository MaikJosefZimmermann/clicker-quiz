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
                controller: 'quizListCtrl as vm'                              // this view shall use the ListCtrl previously declared.
            });
    }

    function quizListCtrl($state, $http) {                      // our controller for this view
        var vm = this;

        $http({                                                     // get all users from node server
            method: 'GET',
            url: '/api/quizes'
        }).then(function successCallback(response) {
            vm.quizes = response.data;// (async) when receive the response load the data into $scope.users
            timeSum(vm.quizes);

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

        function timeSum(quizes) {
            var total = 0;


            angular.forEach(quizes, function (quiz) {
                for (var i = 0; i < quiz.questions.length; i++) {
                    total = total + quiz.questions[i].time;

                }
                var min = total / 60;
                var sek = total % 60;

                var str = min.toString();
                str = str.substring(0, str.indexOf("."));


                console.log("Minuten:");
                console.log(min);
                console.log("Sekunden:");
                console.log(sek);
                quiz.TiSum = str + " Minuten " + sek + " Sekunden ";


            });


            // vm.quiz.timeSum = total;
            // console.log("timesum");
            //console.log(vm.quiz.timeSum);
            //return total;

        }

    }
})();
