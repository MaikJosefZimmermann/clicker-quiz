angular.module('amDate', []).directive('amDatepicker', ['$mdDialog', function($mdDialog){
  return {
    restrict: 'E',
    require: '^ngModel',
    scope: {
      label: '@?',
      cancel: '@',
      save: '@',
      separator: '@',
      ngModel: '=',
      iclass: '@'
    },
    template: '<md-input-container class="md-icon-float block m0">' +
              '<label>{{label != null ? label : "Date"}}</label>'+
              '<md-icon ng-click="datepick($event)" class="material-icons c-pointer {{iclass}}">&#xE878;</md-icon>' +
              '<input ng-model="ngModel">' +
              '</md-input-container>',
    link: function(scope, element, attrs) {
      scope.datepick = function(ev) {
        $mdDialog.show({
          controller: function() {
            this.date = scope.ngModel;
            this.separator = scope.separator;
            this.cancel = scope.cancel;
            this.save = scope.save;

            this.days = {};
            this.dayofweeks = {};
            this.today = moment();

            this.currentDay;
            this.year;
            this.monthNameLong;
            this.monthNameShort;
            this.month;
            this.dayName;
            this.day;
            this.yearModel;

            this.init = function() {
              if(scope.cancel == null)
                this.cancel = 'Cancel';
              else
                this.cancel = scope.cancel;
              if(scope.save == null)
                this.save = 'Save';
              else
                this.save = scope.save;
              if(scope.separator == null)
                this.separator = '-';
              else
                this.separator = scope.separator;
              if(scope.ngModel == null || scope.ngModel == '')
                this.currentDay = this.today;
              else {
                this.datesplit = this.date.split(scope.separator);
                if(this.datesplit[0] < 10)
                  this.datesplit[0] = '0' + this.datesplit[0];
                this.currentDay = moment(this.datesplit[2]+"-"+this.datesplit[1]+"-"+this.datesplit[0]);
              }
              this.yearPick = this.currentDay.format('YYYY');
              this.year = this.currentDay.format('YYYY');
              this.monthNameLong = this.currentDay.format('MMMM');
              this.monthNameShort = this.currentDay.format('MMM');
              this.month = this.currentDay.format('M');
              this.dayName = this.currentDay.format('dddd');
              this.day = this.currentDay.format('D');
              this.week();
              this.fillDays();
            };

            this.week = function() {
              var firstday = moment().weekday(6);
              for(var i=0;i<7;i++)
                this.dayofweeks[i] = firstday.add(1, "days").format('dd');
            };

            this.prevDay = function() {
              this.currentDay = this.currentDay.subtract(1, 'd');
              this.updateDate();
            };

            this.nextDay = function() {
              this.currentDay = this.currentDay.add(1, 'd');
              this.updateDate();
            };

            this.prevMonthMob = function() {
              this.currentDay = this.currentDay.subtract(1, "M");
              if(this.month == 1) {
                this.month = 12
              } else {
                this.month--;
              }
              this.updateDate();
            };

            this.nextMonthMob = function() {
              this.currentDay = this.currentDay.add(1, "M");
              if(this.month == 12) {
                this.month = 1
              } else {
                this.month++;
              }
              this.updateDate();
            };

            this.prevYear = function() {
              this.currentDay = this.currentDay.subtract(1, "Y");
              this.updateDate();
            };

            this.nextYear = function() {
              this.currentDay = this.currentDay.add(1, "Y");
              this.updateDate();
            };

            this.nextMonth = function() {
              this.currentDay = this.currentDay.add(1, 'M');
              if(this.month == 12) {
                this.month = 1
              } else {
                this.month++;
              }
              this.updateDate();
            };

            this.prevMonth = function() {
              this.currentDay = this.currentDay.subtract(1, 'M');
              if(this.month == 1) {
                this.month = 12
              } else {
                this.month--;
              }
              this.updateDate();
            };

            this.selectDay = function(day) {
              var picked = moment(this.yearPick+"-"+this.month+"-"+day);
              this.dayName = picked.format('dddd');
              this.monthNameShort = picked.format('MMM');
              this.day = picked.format('D');
              this.year = picked.format('YYYY');
              this.currentDay = moment(this.yearPick+"-"+this.month+"-"+day)
            };

            this.updateDate = function() {
              this.yearPick = this.currentDay.format('YYYY');
              this.year = this.yearPick;
              this.monthNameLong = this.currentDay.format('MMMM');
              this.monthNameShort = this.currentDay.format('MMM');
              this.dayName = this.currentDay.format('dddd');
              this.day = this.currentDay.format('D');
              this.fillDays();
            };

            this.updateYear = function(year) {
              this.currentYear = this.currentDay.year(year);
              this.updateDate();
            };

            this.fillDays = function(){
              var picked = moment(this.yearPick+"-"+this.month+"-01");
              var j = moment(""+picked.format('YYYY')+"-"+picked.format('MM')+"", "YYYY-MM").daysInMonth();
              var k = picked.format('e');
              this.days = {};
              for(var i=0; i<k; i++) {
                this.days[i] = 0;
              }
              for(var i=1; i<=j;i++) {
                this.days[k] = i;
                k++;
              }
            };

            this.abort = function() {
              this.hide('abort');
            };

            this.confirm = function(year, month, day) {
              var answer = day + this.separator + month + this.separator + year;
              this.hide(answer);
            };

            this.hide = function(answer) {
              $mdDialog.hide(answer);
            }
          },
          controllerAs: 'pickCtrl',
          templateUrl: 'angular-material-datepicker.tpl',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true
        }).then(function(answer) {
          if(answer != 'abort') {
            scope.ngModel = answer;
          }
        }, function() {
          // clickOutsideToClose handler
          // console.log("Datepicker closed");
        })
      };
    }
  }
}]);

'use strict';

angular.module('amDate').run(['$templateCache', function($templateCache) {

  $templateCache.put('angular-material-datepicker.tpl', '<md-dialog aria-label="Pick date" class="datepicker" ng-init="pickCtrl.init()"><div layout="row" layout-sm="column" layout-md="column" layout-lg="row"><div flex="50" flex-sm="100" class="picked"><div class="ta-center dayofweek">{{pickCtrl.dayName}}</div><div hide-sm flex class="mob">&nbsp;</div><span class="ta-center day"><i hide-md hide-lg hide-gt-lg ng-click="pickCtrl.prevDay()" class="material-icons c-pointer date-green-inverse ta-left">&#xE5CB;</i> <i ng-click="pickCtrl.test()" class="dt">{{pickCtrl.day}}</i> <i hide-md hide-lg hide-gt-lg ng-click="pickCtrl.nextDay()" class="material-icons c-pointer date-green-inverse ta-right">&#xE5CC;</i></span> <span class="ta-center month"><i hide-md hide-lg hide-gt-lg ng-click="pickCtrl.prevMonthMob()" class="material-icons c-pointer date-green-inverse ta-left">&#xE5CB;</i> <i ng-click="pickCtrl.test()" class="dt">{{pickCtrl.monthNameShort | uppercase}}</i> <i hide-md hide-lg hide-gt-lg ng-click="pickCtrl.nextMonthMob()" class="material-icons c-pointer date-green-inverse ta-right">&#xE5CC;</i></span> <span class="ta-center year"><i hide-md hide-lg hide-gt-lg ng-click="pickCtrl.prevYear()" class="material-icons c-pointer date-green-inverse ta-left">&#xE5CB;</i> <i ng-click="pickCtrl.test()" class="dt">{{pickCtrl.year}}</i> <i hide-md hide-lg hide-gt-lg ng-click="pickCtrl.nextYear()" class="material-icons c-pointer date-green-inverse ta-right">&#xE5CC;</i></span><div show-sm hide-md hide-lg hide-gt-lg layout="row" class="save-mobile" flex="auto"><button class="md-button" ng-click="pickCtrl.abort()" flex="20">{{pickCtrl.cancel}}</button> <button class="md-button" ng-click="pickCtrl.confirm(pickCtrl.year, pickCtrl.month, pickCtrl.day)" flex="20">{{pickCtrl.save}}</button></div></div><div flex="50" hide-sm flex-sm="100" class="date-pick"><div layout="row"><div class="prev-month"><i ng-click="pickCtrl.prevMonth()" class="material-icons c-pointer date-green ta-left" flex="none">&#xE5CB;</i></div><div class="month-pick" layout="row" flex><span flex="auto">{{pickCtrl.monthNameLong}} <input type="number" class="year-pick" ng-model="inputYear" ng-change="pickCtrl.updateYear(inputYear)" value="{{pickCtrl.yearPick}}"></span></div><div class="next-month"><i ng-click="pickCtrl.nextMonth()" class="material-icons c-pointer date-green ta-right" flex="none">&#xE5CC;</i></div></div><div layout="column"><div class="day-pick"><div class="weeks c-default" flex><span ng-repeat="dn in pickCtrl.dayofweeks"><md-button md-no-ink class="week-btn c-default">{{dn}}</md-button></span></div><span ng-repeat="d in pickCtrl.days"><md-button ng-click="pickCtrl.selectDay(d)" class="day-btn ng-class:{disabled: !d, active: d == pickCtrl.day}">{{d}}</md-button></span></div><div class="md-buttons ta-right" flex="20"><button class="date-green md-button abort" ng-click="pickCtrl.abort()">{{pickCtrl.cancel}}</button> <button class="date-green md-button confirm" ng-click="pickCtrl.confirm(pickCtrl.year, pickCtrl.month, pickCtrl.day)">{{pickCtrl.save}}</button></div></div></div></div></md-dialog>');

}]);