(function () {
    'use strict';

    angular
        .module('app.questionSingle', [])                   // creates new module
        .config(config)                             // config function for our module app.single
        .controller('questionEditCtrl', questionEditCtrl)           // bind EditCtrl to module
        .controller('questionAddCtrl', questionAddCtrl)           // bind AddCtrl to module
        .controller('chipCtrl', chipCtrl);
    function config($stateProvider) {               // inject $stateProvider into config object

        $stateProvider                              // declare our two views ( both use the same template but have different controllers
            .state('questionedit', {                        // edit state..
                url: '/questionedit/:id',                   // url is '/edit/'+id as a url parameter ( check line  32 to see how we use the id with $stateParams
                templateUrl: 'routes/lecturer/questionSingle/questionSingle.html',       // defines the HTML template
                controller: 'questionEditCtrl as vm'              // this view shall use the EditCtrl previously declared.
            })
            .state('questionadd', {                         // add view
                url: '/questionadd',                        // this time without any parameters in the url
                templateUrl: 'routes/lecturer/questionSingle/questionSingle.html',   // loads the HTML template
                controller: 'questionAddCtrl as vm'               // this view shall use the AddCtrl previously declared.
            });

    }

    var chips;


    function questionEditCtrl($stateParams, $http, $state, $localStorage) {    // inject stuff into our Ctrl Function so that we can use them.
        var vm = this;
        vm.edit = true;                                     // set the scope variable "edit" to true, anything that is within the scope is accessible from within the html template. See single.html line #5, ng if uses this

        $http({                                                 // http get requst to our api passing the id. this will load a specific user object
            method: 'GET',
            url: '/api/questions/' + $stateParams.id
        }).then(function successCallback(response) {          // hint: async! when the data is fetched we do ..
            vm.question = response.data;                        // load the response data to the scope.user obj
            setTags(vm.question.tags);
            vm.question.creator = $localStorage.user;

        });


        vm.delete = function (id) {                           // declare a scope function ( which is also accessible from html template)
            $http({                                             // if button (single.html line 44) is clicked this function will send a DELETE request to our node server and passes the id
                method: 'DELETE',
                url: '/api/questions/' + $stateParams.id
            }).then(function successCallback(response) {
                $state.go('questionList');                       // when the server responses we rediret to the list
            });
        };

        /* vm.delete = function (id) {                           // declare a scope function ( which is also accessible from html template)

         $http({                                             // if button (single.html line 44) is clicked this function will send a DELETE request to our node server and passes the id
         method: 'DELETE',
         url: '/api/questions/' + id
         }) .then(function successCallback(response) {

         // when the server responses we rediret to the list
         });
         $state.go('questionList');
         };*/

        vm.questionSave = function () {
            saveTags(vm.question);                             // another scope function that will save a user object to our nodejs server
            $http({
                method: 'PUT',                                  // hint: learn http request verbs: get, put (change), delete
                data: vm.question,                              // this passes the data from the user object  to the request.
                url: '/api/questions/' + $stateParams.id
            }).then(function successCallback(response) {
                $state.go('questionList');
            });
        };
    }

    function questionAddCtrl($http, $state, $localStorage) {
        var vm = this;
        vm.new = true;                                       // counterpart to line 28 to set apart whether edit or save operations should be displayed in the view.

        vm.questionSave = function () {                        // for new users we only need the save function
            saveTags(vm.question);
            console.log(vm.question);
            vm.question.creator = $localStorage.user;


            $http({                                              // same as in the EditCtrl
                method: 'POST',
                data: vm.question,
                url: '/api/questions'
            }).then(function successCallback(response) {
                $state.go('questionList');
            });
        };
    }


    function chipCtrl() {

        var self = this;
        self.readonly = false;
        self.tags = [];
        chips = self;
    }

    function saveTags(currentQuestion) {


        currentQuestion.tags = chips.tags;


    }

    function setTags(tags) {

        var temp = tags.split(",");
        chips.tags = temp;

    }

})();