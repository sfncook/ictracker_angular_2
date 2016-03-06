angular.module('IncidentServices', ['DataServices', 'SectorServices'])

  .factory('IncidentTypes', function () {
    return [];
  })

  .controller('StrategyDlg', function ($scope, $http, DataStore) {
    $scope.dataStore = DataStore;
    DataStore.showStrategyDlg = function () {
      $("#strategy_dlg").dialog('open');
    }
    $scope.setStrategy = function (strategyType) {
      DataStore.incident.strategy = strategyType;
      DataStore.incident.save();
      $("#strategy_dlg").dialog('close');
    }
  })

  .factory('LoadAllIncidents', function (DataStore) {
    return function () {
      return DataStore.adapter.LoadAllIncidents();
    }
  })

  .factory('LoadIncident', function (DataStore) {
    return function (incidentObjectId) {
      return DataStore.adapter.LoadIncident(incidentObjectId);
    }
  })
  .factory('LoadIncidentTypes', function (DataStore) {
    return function () {
      return DataStore.adapter.LoadIncidentTypes();
    }
  })
  .factory('CreateNewIncident', function (DataStore) {
    return function () {
      var incidentObject = DataStore.adapter.CreateNewIncident();
      incidentObject.inc_number = "";
      incidentObject.inc_address = "";
      incidentObject.strategy = "";
      return incidentObject;
    }
  })

  .factory('Incidents', function () {
    return [];
  })

  .factory('SaveIncident', function (DataStore) {
    return function (incident) {
      DataStore.dirtyData = true;
      incident.dirty = true;
      return DataStore.adapter.SaveIncident(incident).then(
        function() {
          DataStore.dirtyData = false;
          incident.dirty = false;
        }
      );
    }
  })

  .filter('sortIncTypeByOrder', function () {
    return function (array) {
      if (array) {
        array.sort(function (a, b) {
          return a.order - b.order;
        });
      }
      return array;
    }
  })

  .factory('DeepCopyIncident', function (DataStore, DeepCopySectorToSector) {
    return function (src_incident) {
      if(!DataStore.dirtyData) {
        var dst_incident = DataStore.incident;
        dst_incident.inc_number = src_incident.inc_number;
        dst_incident.inc_address = src_incident.inc_address;
        dst_incident.strategy = src_incident.strategy;
        dst_incident.txid = src_incident.txid;
        var sectors_src = src_incident.sectors;
        var sectors_dst = dst_incident.sectors;
        for(var i=0; i<sectors_src.length; i++) {
          var sector_src = sectors_src[i];
          var sector_dst = sectors_dst[i];
          DeepCopySectorToSector(sector_src, sector_dst);
        }
      }
    }
  })

;


