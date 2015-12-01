(function () {
    'use strict';

    angular
        .module("app.quiz", [])                                     // creates new module
        .config(config)                                             // config function for our module app.list
        .controller('QuizCtrl', QuizCtrl);                          // bind ListCtrl to module


    function config($stateProvider) {                               // inject $stateProvider into config object
        $stateProvider
            .state('quiz', {                                        // declare list view
                url: "/quiz",                                       // set url
                templateUrl: 'routes/quiz/quiz.html',           // defines the HTML template
                controller: 'QuizCtrl'                              // this view shall use the ListCtrl previously declared.
            })
    }



    function QuizCtrl($scope) {         // our controller for this view
        $scope.frage ='frage1';


        $scope.answers = [
            {'id': 0, antwort:'antwort1'},
            {'id': 1, antwort:'antwort2'},
            {'id': 2, antwort:'antwort3'}
        ];



$scope.answer = function(btn) {



    $scope.frage=btn;
    if(btn =='0') {
        $scope.frage = 'a=0';
    }
    if(btn =='1'){
        $scope.frage = 'a=1';
    }

    if(a =='2'){
        $scope.frage = 'ok';
    }

}
    }
})();
