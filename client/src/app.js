(function () {
    'use strict';

    angular
        .module('app', [

            /* external Modules: */
            'ngAnimate',
            'ngMaterial',
            'ngAria',
            'ui.router',
            'btford.socket-io',


            /* Routes: */
            'app.scoreList',
            'app.scoreSingle',
            'app.preQuiz',

            'app.login',
            'app.quiz',
            'app.quizSingle',
            'app.questionSingle',
            'app.questionList',
            'app.list',
            'app.single',
            'app.quizList',
            'app.quizSingleStudent',
            'app.scoreStudent',
            'ngStorage'

        ])
        .config(AppConfig)
        .run(AppRun)
        .service('socket', socket);

    function AppRun($rootScope, authService, $state, $localStorage, socket) {
        authService.check();
        $rootScope.logout = authService.logout;
        //stateChangeStart & check wird beim routen wechsel getriggert
        //start ladebalken
        //nicht eingeloggte user abfangen

        $rootScope.$on('$stateChangeStart', function (event, nextRoute) {
            if (!authService.isLogged && nextRoute.name !== 'login') {
                $rootScope.notLogged = true;
                event.preventDefault();
                $state.go('login');
            }
        });

        //TODO wird momentan nicht benutzt
        //wenn user eingeloggt dann direkt auf die quizseite
        //user roll checken, admin auf adminseite, student auf studentenseite
        $rootScope.$on('$stateChangeSuccess', function (event, nextRoute) {
            if (authService.isLogged === true && nextRoute.name === 'login') {
                $rootScope.userRole = $localStorage.userRole;
                event.preventDefault();
                $state.go('login');
                //TODO Unterscheidung ob Prof oder Student
                // wenn user eingeloggt
            } else if (authService.isLogged == true) {
                //abfragen der UserRolle
                $rootScope.userRole = $localStorage.userRole;
                $rootScope.username = $localStorage.username;
            }
        });

    }

    function socket(socketFactory, $localStorage, $location) {


        if ($location.absUrl().indexOf('localhost') >= 0) {
            return socketFactory({
                ioSocket: io.connect('localhost:9000', {
                    path: '/api/socket.io',
                    'query': 'token=' + $localStorage.token
                })
            })
        }
        else {
            return socketFactory({

                // Amazon Server  ioSocket: io.connect('https://ec2-52-35-34-22.us-west-2.compute.amazonaws.com:9000')
                ioSocket: io.connect('https://ec2-52-35-34-22.us-west-2.compute.amazonaws.com', {
                    path: '/api/socket.io',
                    'query': 'token=' + $localStorage.token
                })
            });


        }
    }


    function AppConfig($urlRouterProvider, $httpProvider) {
        $httpProvider.interceptors.push('tokenInterceptor');
        $urlRouterProvider.otherwise('/quiz');

        /*  $urlRouterProvider.otherwise(function ($injector) {
         var $state = $injector.get('$state');
         $state.go('display');
         });*/


    }

    /*function AppRun(socket) {

     socket.emit('requestRooms');
     }

     function socket(socketFactory){
     return socketFactory({
     ioSocket: io.connect('/api')
     });
     }
     */
})();
