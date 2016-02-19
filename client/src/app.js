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
            'app.display',
            'app.scoreList',
            'app.scoreSingle',
            'app.preQuiz',
            // 'app.questionList',
            // 'app.questionSingle',
            'app.login',
            'app.quiz',
            'app.quizSingle',
            'app.questionSingle',
            'app.questionList',
            'app.list',
            'app.single',
            'app.quizListLecturer',
            'app.quizList',
            'app.quizSingleStudent',
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
                console.log("Nutzer eingeloggt");
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
                console.log("eingeloggt");
                event.preventDefault();
                $state.go('login');
                //TODO Unterscheidung ob Prof oder Student
                // wenn user eingeloggt
            }else if (authService.isLogged == true) {
                //abfragen der UserRolle
                $rootScope.userRole = $localStorage.userRole;
                $rootScope.user = $localStorage.user;
            }
        });

    }

    function socket(socketFactory) {
        return socketFactory({
            ioSocket: io.connect('52.35.34.22')
        });
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
