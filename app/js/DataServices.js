angular.module('DataServices', ['ParseAdapter', 'StaticAdapter'])
  .factory('DefaultCity', function () {
    return "Mesa";
  })

  .factory('DataStore', function (ParseAdapter, StaticAdapter) {
    return {
      incident: {},
      currentUser: {},
      waitingToLoad: true,
      loadSuccess: false,
      choosing_unit_for_new_mayday: false,

      init: function () {
        var adapter_id_str = getHttpRequestByName('adapter');

        if (adapter_id_str == "") {
          // Check for misspelling of work adapter
          adapter_id_str = getHttpRequestByName('adaptor');
          if (adapter_id_str == "") {
            console.log("Missing required 'adapter' parameter. Using default 'parse' adapter.");
            this.adapter = ParseAdapter;
          }
        }

        if (adapter_id_str != "") {
          if (ParseAdapter.adapter_id_str == adapter_id_str) {
            this.adapter = ParseAdapter;
          } else if (StaticAdapter.adapter_id_str == adapter_id_str) {
            this.adapter = StaticAdapter;
          } else {
            console.error("Invalid or unhandled adapter parameter: ", this.adapter);
          }
        }

        if (this.adapter.init) {
          return this.adapter.init();
        } else {
          return null;
        }
      },
      adapter: {},
      isLoggedIn: function () {
        return this.adapter.isLoggedIn();
      },
      SaveIncident: function (incident) {
        return this.adapter.SaveIncident(incident);
      },
      SaveSector: function (sector) {
        return this.adapter.SaveSector(sector);
      },
      SaveReportAction: function (sector, text) {
        return this.adapter.SaveReportAction(this.incident, sector, text);
      }
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

;
