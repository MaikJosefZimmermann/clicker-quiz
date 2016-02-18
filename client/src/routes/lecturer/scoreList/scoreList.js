/**
 * Created by maikzimmermann on 18.02.16.
 */

(function () {
    'use strict';

    angular
        .module('app.scoreList', [])                                     // creates new module
        .config(config)                                             // config function for our module app.list
        .controller('scoreListCtrl', scoreListCtrl);                          // bind ListCtrl to module


    function config($stateProvider) {
        // inject $stateProvider into config object
        $stateProvider
            .state('scoreList', {                                        // declare list view
                url: '/scoreList/',                                       // set url
                templateUrl: 'routes/lecturer/scoreList.html',           // defines the HTML template
                controller: 'scoreListCtrl as vm'                              // this view shall use the ListCtrl previously declared.
            });
    }

    function scoreListCtrl($stateParams, $http, $state, $timeout, socket) {// our controller for this view

    }
})();