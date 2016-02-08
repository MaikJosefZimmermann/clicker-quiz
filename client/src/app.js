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
            'app.quiz',
            'app.quizSingle',
            'app.list',
            'app.single',
            'app.quizListLecturer',
            'app.quizList'

        ])
        .config(AppConfig);
    /*.run(AppRun)
     .service('socket', socket);*/


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
