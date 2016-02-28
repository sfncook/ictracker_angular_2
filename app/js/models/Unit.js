// Default values
var DEFAULT_hasPar = false;
var DEFAULT_manyPeople = 0;
var DEFAULT_par = 0;
var DEFAULT_psi = 4000;
var DEFAULT_type = null;
var DEFAULT_sector = null;
var DEFAULT_timer_start = new Date();

function Unit(hasPar,     // bool
                manyPeople, // int
                par,        // int
                psi,        // int
                type,       // UnitType
                sector,     // Sector
                timer_start // DateTime
) {
  this.hasPar = typeof hasPar !== 'undefined' ? hasPar : DEFAULT_hasPar;
  this.manyPeople = typeof manyPeople !== 'undefined' ? manyPeople : DEFAULT_manyPeople;
  this.par = typeof par !== 'undefined' ? par : DEFAULT_par;
  this.psi = typeof psi !== 'undefined' ? psi : DEFAULT_psi;
  this.type = typeof type !== 'undefined' ? type : DEFAULT_type;
  this.sector = typeof sector !== 'undefined' ? type : DEFAULT_sector;
  this.timer_start = typeof timer_start !== 'undefined' ? timer_start : DEFAULT_timer_start;
}

