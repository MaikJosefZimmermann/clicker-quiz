(function () {
    'use strict';

    angular
        .module('app.quizSingle', ['ngMaterial','mdPickers'])                   // creates new module
        .config(config)                             // config function for our module app.single
        .controller('qEditCtrl', qEditCtrl)           // bind EditCtrl to module
        .controller('qAddCtrl', qAddCtrl)
        .controller('dialogCtrl', dialogCtrl);


    // bind AddCtrl to module

    function config($stateProvider) {               // inject $stateProvider into config object

        $stateProvider                              // declare our two views ( both use the same template but have different controllers
            .state('qedit', {                        // edit state..
                url: '/qedit/:id',                   // url is '/edit/'+id as a url parameter ( check line  32 to see how we use the id with $stateParams
                templateUrl: 'routes/lecturer/quizSingle/quizSingle.html',       // defines the HTML template
                controller: 'qEditCtrl as vm'              // this view shall use the EditCtrl previously declared.
            })

            .state('qadd', {                         // add view
                url: '/qadd',                        // this time without any parameters in the url
                templateUrl: 'routes/lecturer/quizSingle/quizSingle.html',   // loads the HTML template
                controller: 'qAddCtrl as vm'               // this view shall use the AddCtrl previously declared.
            });


    }


    function qEditCtrl($stateParams, $http, $state, $mdDialog) {
        var vm = this;
        vm.edit = true;                                     // set the scope variable "edit" to true, anything that is within the scope is accessible from within the html template. See single.html line #5, ng if uses this

        $http({                                                     // get all users from node server
            method: 'GET',
            url: '/api/questions'
        }).then(function successCallback(response) {
            vm.questions = response.data;                       // (async) when receive the response load the data into $scope.users


        });

        $http({                                                 // http get requst to our api passing the id. this will load a specific user object
            method: 'GET',
            url: '/api/quizes/' + $stateParams.id
        }).then(function successCallback(response) {            // hint: async! when the data is fetched we do ..
            vm.quiz = response.data;
            vm.verifiedStart= vm.quiz.verifiedStart;

            if (vm.verifiedStart == false) {
                vm.quiz.dateTime = new Date(vm.quiz.myDate);
            }

            console.log(vm.quiz)

        });
        var currentQuestion = [];
        angular.forEach(vm.quiz, function (question) {

            if (question.selected === true) {
                ergebnis.push(question)
            }

        });


        vm.qsave = function (vm) {

            var ergebnis = [];
            angular.forEach(vm.questions, function (question) {
                if (question.selected === true) {
                    if (question.time === 0 || question.time === null) {
                        question.time = vm.time;
                    }
                    ergebnis.push(question)
                }

            });

            angular.forEach(vm.quiz.questions, function (question) {

                if (question.selected === true) {
                    ergebnis.push(question)

                }

            });


            if(vm.verifiedStart == true) {
                vm.quiz.dateTime = undefined;
            }

            var data = {
                qname: vm.quiz.qname,
                questions: ergebnis,
                key: vm.quiz.key,
                myDate: vm.quiz.dateTime,
                verifiedStart: vm.verifiedStart
            };

            console.log(data);
            // for new users we only need the save function

            $http({
                method: 'PUT',                                  // hint: learn http request verbs: get, put (change), delete
                data: data,                              // this passes the data from the user object  to the request.
                url: '/api/quizes/' + $stateParams.id
            }).then(function successCallback(response) {
                $state.go('quizList');
            });
        };

        vm.exists = function (question) {


            return question.selected;
            console.log(question.selected);


            // console.log(question);

        };

        vm.change = function (question) {
            var a = false;
            if (question.selected == true) {

                question.selected = false;

            } else {

                question.selected = true;

            }

            angular.forEach(vm.questions, function (question) {

                if (question.selected == true) {
                    a = true;
                }

            });

            if (a == true) {
                vm.button = true;
            }
            else {
                vm.button = false;
            }


        };
        vm.goDialog = function (question) {

            $mdDialog.show({

                controller: 'dialogCtrl as vm',
                templateUrl: 'routes/lecturer/quizSingle/questionEditDialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                locals: {question: question}
            })

        };
    }


// var vm;
    function qAddCtrl($http, $mdDialog, $state) {

        var vm = this;
        vm.selected = [];
        vm.new = true;
        vm.verifiedStart = false;
        vm.quizStart = false;
        vm.time;


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
            var a = false;
            if (question.selected == true) {

                question.selected = false;

            } else {

                question.selected = true;

            }

            angular.forEach(vm.questions, function (question) {

                if (question.selected == true) {
                    a = true;
                }

            });

            if (a == true) {
                vm.button = true;
            }
            else {
                vm.button = false;
            }


        };

        vm.saveQuiz = function () {

            if (vm.quiz.key) {


                var ergebnis = [];
                console.log("vm.time")
                console.log(vm.time)

                angular.forEach(vm.questions, function (question) {

                    if (question.selected === true) {
                        if (question.time === 0 || question.time === null) {
                            question.time = vm.time;
                        }
                        ergebnis.push(question)
                    }

                });

                if (vm.verifiedStart == true) {
                    vm.quiz.dateTime = undefined;
                }

                var data = {
                    qname: vm.quiz.qname,
                    questions: ergebnis,
                    key: vm.quiz.key,
                    myDate: vm.quiz.dateTime,
                    verifiedStart: vm.verifiedStart,
                    quizStart: vm.quizStart
                };

                // for new users we only need the save function
                $http({                                              // same as in the EditCtrl
                    method: 'POST',
                    data: data,
                    url: '/api/quizes'
                }).then(function successCallback() {
                    $state.go('quizList');
                })

            }
            else {

                alert("Bitte vergeben Sie einen Einschreibeschlüssel")
                document.getElementById("key").focus();

            }


        }

        vm.goDialog = function (question) {


            $mdDialog.show({

                controller: 'dialogCtrl as vm',
                templateUrl: 'routes/lecturer/quizSingle/questionEditDialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                locals: {question: question}


            })

        };
    }


    function dialogCtrl($mdDialog, $http, question) {
        var vm = this;
        vm.question = question;

        vm.save = function (newQuestion) {


            $mdDialog.cancel(newQuestion);

        };


        vm.cancel = function () {
            $mdDialog.cancel();
        };


    }


})();
