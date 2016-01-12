(function () {
    'use strict';

    angular
        .module('app.display', [])
        .config(config)
        .controller('displayCtrl', displayCtrl);


    function config($stateProvider) {
        $stateProvider
            .state('display', {
                url: '/display',
                templateUrl: 'routes/display/display.html',
                controller: 'displayCtrl as vm'
            });


    }


    function displayCtrl(socket) {
        /*jshint validthis: true */
        var vm = this;
        vm.join = join;
        vm.dice = dice;
        vm.room = false;
        vm.show = true;
        vm.toggle = toggle;

        socket.on('printRooms', function (rooms) {
            vm.rooms = rooms;
        });

        socket.on('diceResults', function (diceResults) {
            console.log(diceResults);
        });

        socket.on('joinedRoom', function (room) {
            console.log('You just joined room ' + room);
            vm.rooms = false;
            vm.room = room;
        });


        function join(room) {
            console.log(room);
            socket.emit('joinRoom', room);
        }

        function dice() {
            socket.emit('doDice', vm.room);
        };
        function toggle() {
            vm.show = !vm.show;
        };
    }


})();
