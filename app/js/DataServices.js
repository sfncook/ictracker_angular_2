angular.module('DataServices', ['ParseAdapter', 'StaticAdapter'])
  .factory('DefaultCity', function () {
    return "Mesa";
  })

  .factory('DataStore', function (_Init) {
    return {
      incident: {},
      currentUser: {},
      waitingToLoad: true,
      loadSuccess: false,
      choosing_unit_for_new_mayday: false,

      // Adaptor Services
      adapter:{},
      init: _Init,
      isLoggedIn:         function()       {return this.adapter.isLoggedIn();},
      SaveIncident:       function(incident) {return this.adapter.SaveIncident(incident);},
      SaveSector:         function(sector) {return this.adapter.SaveSector(sector);},
      SaveReportAction:   function(sector, text) {return this.adapter.SaveReportAction(this.incident, sector, text);}
    };
  })

  // TODO: Move this into the ParseAdaptor
  // Pass this into Parse save commands to log errors.
  .factory('DefaultErrorLogger', [function () {
    return {
      error: function (obj, error) {
        console.log('Failed to create new object, with error code: ' + error.message);
      }
    }
  }])

  .factory('_Init', function (ParseAdapter, StaticAdapter) {
    return function () {
      var adapter_id_str = getHttpRequestByName('adapter');

      if(adapter_id_str=="") {
        // Check for misspelling of work adapter
        adapter_id_str = getHttpRequestByName('adaptor');
        if(adapter_id_str=="") {
          console.log("Missing required 'adapter' parameter. Using default 'parse' adapter.");
          this.adapter = ParseAdapter;
        }
      }

      if(adapter_id_str!="") {
        if (ParseAdapter.adapter_id_str == adapter_id_str) {
          this.adapter = ParseAdapter;
        } else if (StaticAdapter.adapter_id_str == adapter_id_str) {
          this.adapter = StaticAdapter;
        } else {
          console.error("Invalid or unhandled adapter parameter: ", adapter);
        }
      }

      if(this.adapter.init) {
        return this.adapter.init();
      } else {
        return null;
      }
    }
  })



/*
 * Adaptor Services
 */

  .factory('CreateNewIncident', function (DataStore) {
    return function () {
      var incidentObject = DataStore.CreateNewIncident();
      incidentObject.inc_number = "";
      incidentObject.inc_address = "";
      incidentObject.strategy = "";
      return incidentObject;
    }
  })

;
