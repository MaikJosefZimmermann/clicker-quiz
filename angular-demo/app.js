(function () {
    'use strict';

    angular
        .module('demo', [])
        .controller('appCtrl', appCtrl);

    function appCtrl($scope, $http) {
        $scope.hello1 = 'Hello World! (from Angular Controller)';

        $http({
            method: 'GET',
            url: 'http://localhost:3000'
        }).then(function (response) {

            $scope.hello2 = response.data.text;

        }, function (response) {

            console.log(response);

        });

    }
})();