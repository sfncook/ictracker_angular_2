angular.module('UnitServices', ['DataServices', 'AdapterServices'])

  .factory('UnitTypes', function () {
    return new Array();
  })

  .factory('LoadUnitTypes', function (AdapterStore) {
    return function () {
      return AdapterStore.adapter.LoadUnitTypes();
    }
  })


  .factory('CreateNewUnit', function (ConvertParseObject, DefaultErrorLogger) {
    return function (sector, unitType) {
      var UnitParseObj = Parse.Object.extend('Unit');
      var newUnit = new UnitParseObj();
      ConvertParseObject(newUnit, UNIT_DEF);
//            newUnit.actions = new Array();
      newUnit.hasPar = false;
      newUnit.manyPeople = 0;
      newUnit.par = 0;
      newUnit.psi = 4000;
      newUnit.type = unitType;
      newUnit.sector = sector;
      newUnit.timer_start = new Date();
      newUnit.save(null, DefaultErrorLogger);
      return newUnit;
    }
  })

  .factory('UpdateUnitTimer', function (DefaultErrorLogger) {
    return function (unit) {
      if(!unit.timer_start) {
        unit.timer_start = new Date();
        unit.save(null, DefaultErrorLogger);
      }
      var t0 = (unit.timer_start).getTime();
      var t1 = (new Date()).getTime();
      var elapsed = parseInt(t1 - t0);
      var elapsedMin = parseInt((elapsed / (1000 * 60)) % 60);
      unit.timer_perc = 100 - parseInt(elapsedMin/15 * 100);
      // 15 minutes total
      // 15 - 10 minutes - green
      // 10 - 5  minutes - yellow
      // 5  - 1  minutes - red
      // 1  - 0  minutes - blink_red
    }
  })

;

