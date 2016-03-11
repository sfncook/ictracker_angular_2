angular.module('IncidentType', [])

  .factory('IncidentType', function (store) {
    return store.defineResource('incidenttype');
  })

;
