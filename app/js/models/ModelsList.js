angular.module('ModelsList', [
  'ActionType',
  'IncidentType',
  'Incident',
  'SectorType',
  'UnitType'
  // Add all adapters to this list otherwise it with not get loaded.
])

  .factory('store', function () {
    var store = new JSData.DS();
    store.registerAdapter('localstorage', new DSLocalStorageAdapter(), { default: true });
    return store;
  })

;
