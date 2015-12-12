(function(){
    'use strict';

    angular                                 // declare our root module:
        .module("app", [                    // we are now in a array where we pass any object we want to inject to root module

            /* external modules: */
            'ngAnimate',
            'ngMaterial',
            'ngAria',
            'ui.router',
            /* our rou                 // important module to handle views and routing
             tes: */


            'app.list',
            'app.single',
            'app.quiz',
            'app.login',
            'app.quizSingle',
            'app.quizList'




        ])
        .config(AppConfig);                 // link config function to our module


    function AppConfig ($urlRouterProvider){
        /* requests without URL will be redirected to the login-view: */
        $urlRouterProvider.otherwise('/list');
    }

})();
