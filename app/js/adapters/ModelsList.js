angular.module('ModelsList', [])

  .factory('JsDataStore', function () {
    var JsDataStore = new JSData.DS();
    JsDataStore.registerAdapter('localstorage', new DSLocalStorageAdapter(), { default: true });
    return JsDataStore;
  })

  .factory('ActionType', function (JsDataStore) {
    return JsDataStore.defineResource('actiontype');
  })

  .factory('IncidentType', function (JsDataStore) {
    return JsDataStore.defineResource('incidenttype');
  })

  .factory('SectorType', function (JsDataStore) {
    return JsDataStore.defineResource('sectortype');
  })

  .factory('UnitType', function (JsDataStore) {
    return JsDataStore.defineResource('unittype');
  })

  .factory('Incident', function (JsDataStore) {
    return JsDataStore.defineResource({
      name: 'incident'
    });
  })

  .factory('Sector', function (JsDataStore) {
    return JsDataStore.defineResource({
      name: 'sector',
      relations: {
        hasOne: {
          sectortype: {
            localKey: 'sectorTypeId',
            localField: 'sectorType'
          }
        }
      }
    });
  })

  //.factory('Unit', function (JsDataStore) {
  //  return JsDataStore.defineResource({
  //    name: 'unit',
  //    relations: {
  //      hasMany: {
  //        actiontype: {
  //          localField: 'actions'
  //        }
  //      }
  //    }
  //  });
  //})

;
