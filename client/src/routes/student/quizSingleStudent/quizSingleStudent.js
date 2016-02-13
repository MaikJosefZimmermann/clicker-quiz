'use strict';
/**
 * Created by maikzimmermann on 11.02.16.
 */
angular
    .module('app.quizSingleStudent', [])                                     // creates new module
    .config(config)                                             // config function for our module app.list
    .controller('quizSingleStudentCtrl', quizSingleStudentCtrl);                          // bind ListCtrl to module


function config($stateProvider) {                               // inject $stateProvider into config object
    $stateProvider
        .state('quizSingleStudent', {                                        // declare list view
            url: '/quizSingleStudent/',                                       // set url
            templateUrl: 'routes/student/quizSingleStudent/quizSingleStudent.html',           // defines the HTML template
            controller: 'quizSingleStudentCtrl as vm'                              // this view shall use the ListCtrl previously declared.
        });
}

function quizSingleStudentCtrl($stateParams, $http) {                      // our controller for this view
    var vm = this;

    $http({                                                     // get all users from node server
        method: 'GET',
        url: '/api/quizSingleStudent' + $stateParams.id
    }).then(function successCallback(response) {
        vm.questions = response.data;                           // (async) when receive the response load the data into $scope.users
        console.log(vm.questions)
    });



}