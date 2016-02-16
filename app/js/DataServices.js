angular.module('DataServices', ['ParseAdapter', 'StaticAdapter'])
  .factory('DefaultCity', function () {
    return "Mesa";
  })

  .factory('DataStore', function (_Init, DataAdapter) {
    return {
      incident: {},
      currentUser: {},
      waitingToLoad: true,
      loadSuccess: false,
      choosing_unit_for_new_mayday: false,

      init: _Init,
      isLoggedIn:         function()       {return DataAdapter.isLoggedIn();},
      SaveIncident:       function(incident) {return DataAdapter.SaveIncident(incident);},
      SaveSector:         function(sector) {return DataAdapter.SaveSector(sector);},
      SaveReportAction:   function(sector, text) {return DataAdapter.SaveReportAction(this.incident, sector, text);}
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

  .factory('_Init', function (ParseAdapter, StaticAdapter, DataAdapter) {
    return function () {
      var adapter_id_str = getHttpRequestByName('adapter');

      if(adapter_id_str=="") {
        // Check for misspelling of work adapter
        adapter_id_str = getHttpRequestByName('adaptor');
        if(adapter_id_str=="") {
          console.log("Missing required 'adapter' parameter. Using default 'parse' adapter.");
          DataAdapter = ParseAdapter;
        }
      }

      if(adapter_id_str!="") {
        if (ParseAdapter.adapter_id_str == adapter_id_str) {
          DataAdapter = ParseAdapter;
        } else if (StaticAdapter.adapter_id_str == adapter_id_str) {
          DataAdapter = StaticAdapter;
        } else {
          console.error("Invalid or unhandled adapter parameter: ", adapter);
        }
      }

      if(DataAdapter.init) {
        return DataAdapter.init();
      } else {
        return null;
      }
    }
  })



/*
 * Adaptor Services
 */

  .factory('DataAdapter', function () { return {}; })

  .factory('CreateNewIncident', function (DataAdapter) {
    return function () {
      var incidentObject = DataAdapter.CreateNewIncident();
      incidentObject.inc_number = "";
      incidentObject.inc_address = "";
      incidentObject.strategy = "";
      return incidentObject;
    }
  })

;
