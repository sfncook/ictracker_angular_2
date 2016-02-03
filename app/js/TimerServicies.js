angular.module('TimerServices', ['DataServices', 'IncidentServices'])

  .factory('StartIncidentTimer',
  function ($interval, DataStore) {
    return function () {
      DataStore.timer_text = "00:00";
      DataStore.hourRollOverDone = false;
      if (DataStore.incident && DataStore.incident.inc_startDate) {
        var t0 = (new Date(DataStore.incident.inc_startDate)).getTime();
      } else {
        DataStore.incident.inc_startDate = new Date();
        var t0 = (DataStore.incident.inc_startDate).getTime();
      }
      function updateTimer() {
        var t1 = (new Date()).getTime();
        var elapsed = parseInt(t1 - t0);
        var elapsedSec = parseInt((elapsed / 1000) % 60);
        var elapsedMin = parseInt((elapsed / (1000 * 60)) % 60);
        var elapsedHr = parseInt((elapsed / (1000 * 60 * 60)) % 60);

        var secStr = (elapsedSec < 10) ? ("0" + elapsedSec) : elapsedSec;
        var minStr = (elapsedMin < 10) ? ("0" + elapsedMin) : elapsedMin;
        var hrStr = (elapsedHr < 10) ? ("0" + elapsedHr) : elapsedHr;

        var new_timer_text = "";
        if (elapsedHr > 0) {
          if (!DataStore.hourRollOverDone) {
            DataStore.hourRollOverDone = true;
          }
          new_timer_text = hrStr + ":" + minStr + ":" + secStr;
        } else {
          new_timer_text = minStr + ":" + secStr;
        }
        DataStore.timer_text = new_timer_text;
      }

      $interval(updateTimer, 1000);
    }
  })

  .factory('StartIncidentUpdateTimer',
  function ($interval, DataStore, UpdateIncidentAsNeeded) {
    return function () {
      function updateIncidentData() {
        UpdateIncidentAsNeeded();
      }

      $interval(updateIncidentData, 3000);
    }
  })

  .factory('StartUnitTimerTimer',
  function ($interval, DataStore, DefaultErrorLogger) {
    return function () {
      function updateAllUnitTimers() {
        if(DataStore.incident.sectors) {
          DataStore.incident.sectors.forEach(function(sector) {
            if(sector.sectorType.hasClock) {
              sector.units.forEach(function(unit) {
                if(!unit.timer_start) {
                  unit.timer_start = new Date();
                  unit.save(null, DefaultErrorLogger);
                }
                var t0 = (unit.timer_start).getTime();
                var t1 = (new Date()).getTime();
                var elapsed = parseInt(t1 - t0);
                var elapsedMin = parseInt((elapsed / (1000 * 60)) % 60);
                unit.timer_perc = 100 - parseInt(elapsedMin/15 * 100);
              });
            }
            // 15 minutes total
            // 15 - 10 minutes - green
            // 10 - 5  minutes - yellow
            // 5  - 1  minutes - red
            // 1  - 0  minutes - blink_red
          });
        }
      }
      updateAllUnitTimers();
      $interval(updateAllUnitTimers, 30000);
    }
  })

;
