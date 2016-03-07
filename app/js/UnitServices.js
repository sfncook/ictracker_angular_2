angular.module('UnitServices', ['DataServices'])

  .factory('UnitTypes', function () {
    return [];
  })

  .factory('LoadUnitTypes', function (DataStore) {
    return function () {
      return DataStore.adapter.LoadUnitTypes();
    }
  })

  .factory('UpdateUnitTimer', function (SaveUnit) {
    return function (unit) {
      if(!unit.timer_start) {
        unit.timer_start = new Date();
        SaveUnit(unit);
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

  .factory('SaveUnit', function (DataStore) {
    return function (unit) {
      DataStore.dirtyData = true;
      unit.dirty = true;
      return DataStore.adapter.SaveUnit(unit).then(
        function() {
          DataStore.dirtyData = false;
          unit.dirty = false;
        }
      );
    }
  })

    .factory('DeepCopyUnitToUnit', function () {
      return function (src_unit, dst_unit) {
        //['actions', '', '', '', '', '', '', '', ''];
        dst_unit.manyPeople = src_unit.manyPeople;
        dst_unit.manyPar = src_unit.manyPar;
        dst_unit.par = src_unit.par;
        dst_unit.psi = src_unit.psi;
        dst_unit.type = src_unit.type;
        dst_unit.timer_start = src_unit.timer_start;
        dst_unit.timer_running = src_unit.timer_running;
        //actions
      }
    })

;

