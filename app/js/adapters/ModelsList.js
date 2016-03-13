angular.module('ModelsList', [])

  .factory('store', function () {
    var store = new JSData.DS();
    store.registerAdapter('localstorage', new DSLocalStorageAdapter(), { default: true });
    return store;
  })

  .factory('ActionType', function (store) {
    return store.defineResource('actiontype');
  })

  .factory('Incident', function (store) {
    return store.defineResource('incident');
  })

  .factory('IncidentType', function (store) {
    return store.defineResource('incidenttype');
  })

  .factory('SectorType', function (store) {
    return store.defineResource('sectortype');
  })

  .factory('UnitType', function (store) {
    return store.defineResource('unittype');
  })
;
