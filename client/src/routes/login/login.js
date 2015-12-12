(function () {
    'use strict';

    angular
        .module('app.login', [])
        .config(config)
        .controller('loginCtrl', loginCtrl);

    function config($stateProvider) {

        $stateProvider
            .state('login', {
                url: '/login/:id',
                templateUrl: 'routes/login/login.html',
                controller: 'loginCtrl as vm'
            });
    }


    function loginCtrl($http, authService, $localStorage, $state) {
        /*jshint validthis: true */
        var vm = this;
        vm.user = {
            username: 'td028',
            password: ''
        };
        vm.submit = submit;

        function submit() {
            $http.post('//localhost:9000/auth', vm.user).then(function (res) {
                // success
                authService.isLogged = true;
                authService.user = res.data.user.username;

                $localStorage.token = res.data.token;
                $localStorage.user = res.data.user.username; // to fetch the user details on refresh

                $state.go('editor');
            }, function (err) {
                console.log(err);
            });

        }


    }


})();
