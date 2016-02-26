<md-dialog aria-label="Pick date" class="datepicker" ng-init="pickCtrl.init()">
  <div layout="row" layout-sm="column" layout-md="column" layout-lg="row">
    <div flex="50" flex-sm="100" class="picked">
      <div class="ta-center dayofweek">{{pickCtrl.dayName}}</div>
      <div hide-sm flex class="mob">&nbsp;</div>
      <span class="ta-center day">
        <i hide-md hide-lg hide-gt-lg ng-click="pickCtrl.prevDay()" class="material-icons c-pointer date-green-inverse ta-left">&#xE5CB;</i>
          <i ng-click="pickCtrl.test()" class="dt">{{pickCtrl.day}}</i>
        <i hide-md hide-lg hide-gt-lg ng-click="pickCtrl.nextDay()" class="material-icons c-pointer date-green-inverse ta-right">&#xE5CC;</i>
      </span>
      <span class="ta-center month">
        <i hide-md hide-lg hide-gt-lg ng-click="pickCtrl.prevMonthMob()" class="material-icons c-pointer date-green-inverse ta-left">&#xE5CB;</i>
          <i ng-click="pickCtrl.test()" class="dt">{{pickCtrl.monthNameShort | uppercase}}</i>
        <i hide-md hide-lg hide-gt-lg ng-click="pickCtrl.nextMonthMob()" class="material-icons c-pointer date-green-inverse ta-right">&#xE5CC;</i>
      </span>
      <span class="ta-center year">
        <i hide-md hide-lg hide-gt-lg ng-click="pickCtrl.prevYear()" class="material-icons c-pointer date-green-inverse ta-left">&#xE5CB;</i>
          <i ng-click="pickCtrl.test()" class="dt">{{pickCtrl.year}}</i>
        <i hide-md hide-lg hide-gt-lg ng-click="pickCtrl.nextYear()" class="material-icons c-pointer date-green-inverse ta-right">&#xE5CC;</i>
      </span>
      <div show-sm hide-md hide-lg hide-gt-lg layout="row" class="save-mobile" flex="auto">
        <button class="md-button" ng-click="pickCtrl.abort()" flex="20">{{pickCtrl.cancel}}</button>
        <button class="md-button" ng-click="pickCtrl.confirm(pickCtrl.year, pickCtrl.month, pickCtrl.day)" flex="20">{{pickCtrl.save}}</button>
      </div>
    </div>
    <div flex="50" hide-sm flex-sm="100" class="date-pick">
      <div layout="row">
        <div class="prev-month"><i ng-click="pickCtrl.prevMonth()" class="material-icons c-pointer date-green ta-left" flex="none">&#xE5CB;</i></div>
        <div class="month-pick" layout="row" flex>
          <span flex="auto">
            {{pickCtrl.monthNameLong}}
            <input type="number" class="year-pick" ng-model="inputYear" ng-change="pickCtrl.updateYear(inputYear)" value={{pickCtrl.yearPick}}></input>
          </span>
        </div>
        <div class="next-month"><i ng-click="pickCtrl.nextMonth()" class="material-icons c-pointer date-green ta-right" flex="none">&#xE5CC;</i></div>
      </div>
      <div layout="column">
        <div class="day-pick">
          <div class="weeks c-default" flex>
            <span ng-repeat="dn in pickCtrl.dayofweeks">
              <md-button md-no-ink class="week-btn c-default">{{dn}}</md-button>
            </span>
          </div>
          <span ng-repeat="d in pickCtrl.days">
            <md-button ng-click="pickCtrl.selectDay(d)" class="day-btn ng-class:{disabled: !d, active: d == pickCtrl.day}">{{d}}</md-button>
          </span>
        </div>
        <div class="md-buttons ta-right" flex="20">
          <button class="date-green md-button abort" ng-click="pickCtrl.abort()">{{pickCtrl.cancel}}</button>
          <button class="date-green md-button confirm" ng-click="pickCtrl.confirm(pickCtrl.year, pickCtrl.month, pickCtrl.day)">{{pickCtrl.save}}</button>
        </div>
      </div>
    </div>
  </div>
</md-dialog>
