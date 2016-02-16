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

        function submit() {
            $http.post('/api/auth', vm.user).then(function (res) {
                // success
                authService.isLogged = true;
                authService.user = res.data.user.username; //userrole admin oder student

                //authService.userRole = res.data.user.type;
                // bei den rollen unterscheiden z.b.
                $localStorage.token = res.data.token;
                $localStorage.user = res.data.user.username; // to fetch the user details on refresh
                $localStorage.userRole = res.data.user.type; // to fetch the user details on refresh

                $rootScope.userRole = $localStorage.userRole;
                //$rootScope.notLogged = 'false';
                $rootScope.notLogged = authService.isLogged;

                console.log("User " + authService.user + " eingeloggt");
                console.log("Role " + authService.userRole + " eingeloggt");
                $state.go('quiz');
            }, function (err) {
                console.log(err);
            });

        }


    }


})();
