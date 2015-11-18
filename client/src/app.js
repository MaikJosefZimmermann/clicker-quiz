(function(){
    'use strict';

    angular                                 // declare our root module:
        .module("app", [                    // we are now in a array where we pass any object we want to inject to root module

            /* external modules: */
            'ngAnimate',
            'ngMaterial',
            'ngAria',
            'ui.router',                    // important module to handle views and routing

            /* our routes: */
            'app.list',
            'app.single'


        ])
        .config(AppConfig);                 // link config function to our module


    function AppConfig ($urlRouterProvider){
        /* requests without URL will be redirected to the list-view: */
        $urlRouterProvider.otherwise('/list');
    }

})();
