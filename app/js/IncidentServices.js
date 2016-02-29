angular.module('IncidentServices', ['DataServices'])

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

  //.factory('UpdateIncidentAsNeeded', function (DataStore) {
  //  return function (incident) {
  //    return DataStore.adapter.UpdateIncidentAsNeeded(incident);
  //  }
  //})

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

;


