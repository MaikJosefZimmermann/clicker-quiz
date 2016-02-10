/*arbeiten mit promisses
 * promis = variable mit status
 * status erfüllt = funktion triggern
 * var promise = $q.defer() <- ich warte
 *
 * promise.resolve{ erfolgreich
 * objekt
 * }
 *
 * promise.reject bei error
 *
 * promise.then(function(result) {}, function(err){})*/
(function () {
    'use strict';
    angular.module('app')
        .factory('tokenInterceptor', function ($q, $localStorage, $rootScope, $injector) {
            return {
                request: function (config) {
                    /*jeder request ohne http
                     * // = nimm das protokoll mit dem du gestartet wurdest
                     *
                     * wenn token da und request geht localhost / amazon
                     * --> x-Access-Token setzen
                     * */
                    config.headers = config.headers || {};
                    console.log($localStorage.token);
                    console.log("tokeninter..")
                    if ($localStorage.token && config.url.substring(0, 11) === '//localhost') {
                        config.headers['X-Access-Token'] = $localStorage.token;
                        config.headers['X-Key'] = $localStorage.user;
                        config.headers['Content-Type'] = 'application/json';
                    }
                    return config || $q.when(config);
                },

                response: function (response) {
                    return response || $q.when(response);
                },

                responseError: function (response) {
                    if (response.status === 401) {//user ausloggen bei 401 Fehler
                        var authService = $injector.get('authService');
                        authService.logout();
                    }
                    return $q.reject(response);
                }

            };
        });
})();