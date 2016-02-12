/**
 * Created by maikzimmermann on 11.02.16.
 */
angular
    .module('app.quizSingleStudent', [])                                     // creates new module
    .config(config)                                             // config function for our module app.list
    .controller('quizSingleStudentCtrl', quizSingleStudentCtrl);                          // bind ListCtrl to module


function config($stateProvider) {                               // inject $stateProvider into config object
    $stateProvider
        .state('quiz', {                                        // declare list view
            url: '/quizSingleStudent',                                       // set url
            templateUrl: 'routes/student/quiz/quizSingleStudent.html',           // defines the HTML template
            controller: 'quizSingleStudentCtrl'                              // this view shall use the ListCtrl previously declared.
        });

    function quizSingleStudentCtrl($state, $http) {                      // our controller for this view
        var vm = this;

        $http({                                                     // get all users from node server
            method: 'GET',
            url: '/api/quizes'
        }).then(function successCallback(response) {
            vm.quizes = response.data;                           // (async) when receive the response load the data into $scope.users
        });


        vm.goQSingle = function (id) {                           // scope function which calls a single state
            $state.go('qedit', {id: id});
        };

    }
}