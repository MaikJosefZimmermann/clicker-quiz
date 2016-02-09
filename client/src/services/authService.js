(function () {
    'use strict';
    angular.module('app')
        .factory('authService', function ($state, $localStorage, $http) {
            /*returnt funktionen die unten aufgerufen werden
             * was macht die datei, welche funktionen*/
            return {
                isLogged: false,
                tokenStillValid: false,
                check: check,
                decodeToken: decodeToken,
                logout: logout
            };

            /*checken ob in localstorage ein token liegt. = user angemeldet
             status wird in variable gespeichert
             checkt ob der token abgelaufen ist
             * localstorage ist auf url gebunden -- finale version
             *
             * ==ist der token da und gültig*/
            function check() {
                /*jshint validthis: true */

                if ($localStorage.token && $localStorage.user) {
                    var decoded = decodeToken($localStorage.token);
                    if (!(decoded && checkExpire(decoded.exp))) {
                        logout();
                        return;
                    }
                    this.isLogged = true;

                } else {
                    this.isLogged = false;
                }


            }

            /*base64 decodierung*/
            function urlBase64Decode(str) {
                var output = str.replace(/-/g, '+').replace(/_/g, '/');
                switch (output.length % 4) {
                    case 0:
                    {
                        break;
                    }
                    case 2:
                    {
                        output += '==';
                        break;
                    }
                    case 3:
                    {
                        output += '=';
                        break;
                    }
                    default:
                    {
                        throw 'Illegal base64url string!';
                    }
                }
                return decodeURIComponent(escape(window.atob(output)));
            }

            /*decodiert den token (3 teile erwartet)
             * ausgabe: json*/
            function decodeToken(token) {
                /*jshint validthis: true */

                var parts = token.split('.');

                if (parts.length !== 3) {
                    console.log('not a token');
                    return false;
                }

                var decoded = urlBase64Decode(parts[1]);
                if (!decoded) {
                    console.log('error while decoding');
                    return false;
                }
                return JSON.parse(decoded);
            }

            /*newdate stellt nicht die zeitzone fest
             * idr request auf server um die zeit sicher zu stellen. - momentjs um die genaue zeit serverseitig auszulesen
             * lässt sich mit bower für front end und npm für backend installieren*/
            function checkExpire(exp) {
                return Math.round(new Date().getTime() / 1000) <= exp;
            }

            /*vm für controller
             * wir loggen den nutzer aus, nimm den token und setze ihn in die blacklist, da weiterhin gültig*/
            function logout() {
                /*jshint validthis: true */

                var self = this;

                $http.post('/api/logout').then(function () {
                    self.isLogged = false;
                    $localStorage.$reset(); // löscht alles aus localstorage
                    $state.go('login');

                }, function (err) {
                    console.log(err); //error angular toast für error meldungen
                });


            }

        });
})();