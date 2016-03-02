// Default values
var DEFAULT_actions = [];
var DEFAULT_manyPeople = 0;
var DEFAULT_par = 0;
var DEFAULT_psi = 4000;
var DEFAULT_sector = null;
var DEFAULT_type = null;
var DEFAULT_timer_start = new Date();
var DEFAULT_timer_running = true;


var Unit = createBaseModelObj();

function createUnit(actions,      // ActionType[]
                    manyPeople,   // int
                    par,          // int
                    psi,          // int
                    sector,       // Sector
                    type,         // UnitType
                    timer_start,  // DateTime
                    timer_running // bool
) {
  var unit = Object.create(ActionType, {
    fields: {
      value: function () {
        return [
          'actions',
          'manyPeople',
          'par',
          'psi',
          'sector',
          'type',
          'timer_start',
          'timer_running'
        ];
      }
    }
  });

  unit.actions = typeof actions !== 'undefined' ? actions : DEFAULT_actions;
  unit.manyPeople = typeof manyPeople !== 'undefined' ? manyPeople : DEFAULT_manyPeople;
  unit.par = typeof par !== 'undefined' ? par : DEFAULT_par;
  unit.psi = typeof psi !== 'undefined' ? psi : DEFAULT_psi;
  unit.sector = typeof sector !== 'undefined' ? type : DEFAULT_sector;
  unit.type = typeof type !== 'undefined' ? type : DEFAULT_type;
  unit.timer_start = typeof timer_start !== 'undefined' ? timer_start : DEFAULT_timer_start;
  unit.timer_running = typeof timer_running !== 'undefined' ? timer_running : DEFAULT_timer_running;

  return unit;
}

// remoteFields: Array of strings - order must match 'fields' value above
function createUnitFromObj(remoteFields, remoteObj) {
  var unit = createUnit();
  unit.updateRemoteToLocal(remoteFields, remoteObj);
  return unit;
}


