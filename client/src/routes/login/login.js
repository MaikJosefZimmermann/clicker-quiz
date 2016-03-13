(function () {
    'use strict';

    angular
        .module('app.login', [])
        .config(config)
        .controller('loginCtrl', loginCtrl);

    function config($stateProvider) {

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'routes/login/login.html',
                controller: 'loginCtrl as vm'
            });
    }


    function loginCtrl($http, authService, $localStorage, $state, $rootScope) {
        /*jshint validthis: true */

        var vm = this;
        vm.user = {
            username: '',
            password: ''
        };
        $rootScope.notLogged = 'notLogged';
        vm.submit = submit;
        vm.submitt = function ($event) {

            if ($event.which === 13) {
                submit();
            }
        };

        function submit() {
            $http.post('/api/auth', vm.user).then(function (res) {
                // success
                console.log("response");
                console.log(res);
                authService.isLogged = true;
                authService.user = res.data.user.username; //userrole admin oder student

                $localStorage.token = res.data.token;
                $localStorage.user = res.data.user.username;
                $localStorage.username = res.data.user.fullname;

                      $localStorage.userRole = res.data.user.type; // to fetch the user details on refresh
               // $localStorage.userRole = "admin"; // to fetch the user details on refresh

                $rootScope.userRole = $localStorage.userRole;
                //$rootScope.notLogged = 'false';
                $rootScope.notLogged = authService.isLogged;

                console.log("User " + authService.user + " eingeloggt");
                console.log("Role " + authService.userRole + " eingeloggt");

                //Rollenunterscheidung
                //Student - Startseite
                if($localStorage.userRole === 'student') {
                    $state.go('quiz');
                    // Admin - Startseite
                }else if($localStorage.userRole === 'admin') {
                    $state.go('quizList');
                } else if ($localStorage.userRole === 'Dozent') {
                    $state.go('quizList');
                }
            }, function (err) {
                console.log(err);
                vm.loginErr = true;
                //alert("Error: " + err.statusText);
            });

        }


    }


})();
