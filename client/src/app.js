(function () {
    'use strict';

    angular
        .module('app', [

            /* external Modules: */
            'ngAnimate',
            'ngMaterial',
            'ngAria',
            'ui.router',
            //'btford.socket-io',


            /* Routes: */
            //'app.display',
            // 'app.questionList',
            // 'app.questionSingle',
            'app.login',
            'app.quiz',
            'app.quizSingle',
            'app.list',
            'app.single',
            'app.quizListLecturer',
            'app.quizList',
            'ngStorage'

        ])
        .config(AppConfig)
        .run(AppRun);

    function AppRun($rootScope, authService, $state) {
        authService.check();
        //stateChangeStart & check wird beim routen wechsel getriggert
        //start ladebalken
        //nicht eingeloggte user abfangen

        $rootScope.$on('$stateChangeStart', function (event, nextRoute) {
            if (!authService.isLogged && nextRoute.name !== 'login') {
                console.log("Nutzer eingeloggt");
                event.preventDefault();
                $state.go('login');
            }
        });
//ladebalken beendet
        //wenn user eingeloggt dann direkt auf die quizseite
        //user roll checken, admin auf adminseite, student auf studentenseite
        $rootScope.$on('$stateChangeSuccess', function (event, nextRoute) {
            if (authService.isLogged === true && nextRoute.name === 'login') {
                console.log(2);
                event.preventDefault();
                $state.go('quiz');
                //TODO Unterscheidung ob Prof oder Student
            }
        });
    }



    function AppConfig($urlRouterProvider) {

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
