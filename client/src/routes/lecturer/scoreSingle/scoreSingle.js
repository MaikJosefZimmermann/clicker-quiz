/**
 * Created by maikzimmermann on 18.02.16.
 */

(function () {
    'use strict';

    angular
        .module('app.scoreSingle', [])                                     // creates new module
        .config(config)                                             // config function for our module app.list
        .controller('scoreSingleCtrl', scoreSingleCtrl);                          // bind ListCtrl to module


    function config($stateProvider) {
        // inject $stateProvider into config object
        $stateProvider
            .state('scoreSingle', {                                        // declare list view
                url: '/scoreSingle',                                       // set url
                templateUrl: 'routes/lecturer/scoreSingle/scoreSingle.html',           // defines the HTML template
                controller: 'scoreSingleCtrl as vm'                              // this view shall use the ListCtrl previously declared.
            });
    }

    function scoreSingleCtrl($stateParams, $http, $state, $timeout, socket) {// our controller for this view

    }
})();