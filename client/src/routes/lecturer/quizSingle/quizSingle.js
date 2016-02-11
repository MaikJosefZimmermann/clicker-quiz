(function () {
    'use strict';

    angular
        .module('app.quizSingle', [])                   // creates new module
        .config(config)                             // config function for our module app.single
        .controller('qEditCtrl', qEditCtrl)           // bind EditCtrl to module
        .controller('qAddCtrl', qAddCtrl)
        .controller('searchCtrl', searchCtrl)
    // bind AddCtrl to module

    function config($stateProvider) {               // inject $stateProvider into config object

        $stateProvider                              // declare our two views ( both use the same template but have different controllers
            .state('qedit', {                        // edit state..
                url: '/qedit/:id',                   // url is '/edit/'+id as a url parameter ( check line  32 to see how we use the id with $stateParams
                templateUrl: 'routes/lecturer/quizSingle/quizSingle.html',       // defines the HTML template
                controller: 'qEditCtrl'              // this view shall use the EditCtrl previously declared.
            })
            .state('qadd', {                         // add view
                url: '/qadd',                        // this time without any parameters in the url
                templateUrl: 'routes/lecturer/quizSingle/quizSingle.html',   // loads the HTML template
                controller: 'qAddCtrl'               // this view shall use the AddCtrl previously declared.
            });

    }

    var allQuestions;

    function qEditCtrl($stateParams, $scope, $http, $state) {    // inject stuff into our Ctrl Function so that we can use them.

        $scope.edit = true;                                     // set the scope variable "edit" to true, anything that is within the scope is accessible from within the html template. See single.html line #5, ng if uses this

        $http({                                                 // http get requst to our api passing the id. this will load a specific user object
            method: 'GET',
            url: '/api/quizes/' + $stateParams.id
        }).then(function successCallback(response) {            // hint: async! when the data is fetched we do ..
            $scope.quiz = response.data;                        // load the response data to the scope.user obj
        });


        $scope.delete = function () {                           // declare a scope function ( which is also accessible from html template)
            $http({                                             // if button (single.html line 44) is clicked this function will send a DELETE request to our node server and passes the id
                method: 'DELETE',
                url: '/api/quizes/' + $stateParams.id
            }).then(function successCallback(response) {
                $state.go('quizList');                       // when the server responses we rediret to the list
            });
        };

        $scope.qsave = function () {                             // another scope function that will save a user object to our nodejs server
            $http({
                method: 'PUT',                                  // hint: learn http request verbs: get, put (change), delete
                data: $scope.quiz,                              // this passes the data from the user object  to the request.
                url: '/api/quizes/' + $stateParams.id
            }).then(function successCallback(response) {
                $state.go('quizList');
            });
        };
    }

    function qAddCtrl($scope, $http, $state) {

        $scope.new = true;                                       // counterpart to line 28 to set apart whether edit or save operations should be displayed in the view.

        $scope.qsave = function () {                              // for new users we only need the save function
            $http({                                              // same as in the EditCtrl
                method: 'POST',
                data: $scope.quiz,
                url: '/api/quizes'
            }).then(function successCallback(response) {
                $state.go('quizList');
            });
        };
    }


    function searchCtrl($http) {                      // our controller for this view
        var vm = this;
        vm.selected = [];

        $http({                                                     // get all users from node server
            method: 'GET',
            url: '/api/questions'
        }).then(function successCallback(response) {
            vm.questions = response.data;                       // (async) when receive the response load the data into $scope.users


        });

        vm.exists = function (question) {


            return question.selected;


            // console.log(question);

        };

        vm.change = function (question) {
            if (question.selected == false) {

                question.selected = true;

            } else {
                question.selected = false;
            }
            console.log("toggle:" + question);


        }

        vm.saveQuiz = function () {
            var ergebnis = [];

            angular.forEach(vm.questions, function (question) {
                console.log("forschleife:" + question);
                if (question.selected === true) {
                    ergebnis.push(question)
                }
                console.log("Array:" + ergebnis);
            })
            angular.forEach(ergebnis, question in ergebnis);
            {

                console.log("ERGEBNIS:" + question);

            }
        }

    }
})();
