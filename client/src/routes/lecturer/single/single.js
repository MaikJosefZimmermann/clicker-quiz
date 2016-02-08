(function () {
    'use strict';

    angular
        .module('app.single', [])                   // creates new module
        .config(config)                             // config function for our module app.single
        .controller('EditCtrl', EditCtrl)           // bind EditCtrl to module
        .controller('AddCtrl', AddCtrl);            // bind AddCtrl to module

    function config($stateProvider) {               // inject $stateProvider into config object

        $stateProvider                              // declare our two views ( both use the same template but have different controllers
            .state('edit', {                        // edit state..
                url: '/edit/:id',                   // url is '/edit/'+id as a url parameter ( check line  32 to see how we use the id with $stateParams
                templateUrl: 'routes/lecturer/single/single.html',       // defines the HTML template
                controller: 'EditCtrl'              // this view shall use the EditCtrl previously declared.
            })
            .state('add', {                         // add view
                url: '/add',                        // this time without any parameters in the url
                templateUrl: 'routes/lecturer/single/single.html',   // loads the HTML template
                controller: 'AddCtrl'               // this view shall use the AddCtrl previously declared.
            });

    }

    function EditCtrl($stateParams, $scope, $http, $state) {    // inject stuff into our Ctrl Function so that we can use them.

        $scope.edit = true;                                     // set the scope variable "edit" to true, anything that is within the scope is accessible from within the html template. See single.html line #5, ng if uses this

        $http({                                                 // http get requst to our api passing the id. this will load a specific user object
            method: 'GET',
            url: 'http://api/users/' + $stateParams.id
        }).then(function successCallback(response) {            // hint: async! when the data is fetched we do ..
            $scope.user = response.data;                        // load the response data to the scope.user obj
        });


        $scope.delete = function () {                           // declare a scope function ( which is also accessible from html template)
            $http({                                             // if button (single.html line 44) is clicked this function will send a DELETE request to our node server and passes the id
                method: 'DELETE',
                url: 'http://api/users/' + $stateParams.id
            }).then(function successCallback(response) {
                $state.go('list')        ;                       // when the server responses we rediret to the list
            });
        };

        $scope.save = function () {                             // another scope function that will save a user object to our nodejs server
            $http({
                method: 'PUT',                                  // hint: learn http request verbs: get, put (change), delete
                data: $scope.user,                              // this passes the data from the user object  to the request.
                url: 'http://api/users/' + $stateParams.id
            }).then(function successCallback(response) {
                $state.go('list');
            });
        };
    }

    function AddCtrl($scope, $http, $state) {

        $scope.new = true;                                       // counterpart to line 28 to set apart whether edit or save operations should be displayed in the view.

        $scope.save = function () {                              // for new users we only need the save function
            $http({                                              // same as in the EditCtrl
                method: 'POST',
                data: $scope.user,
                url: 'http://api/users'
            }).then(function successCallback(response) {
                $state.go('list');
            });
        };
    }

})();
