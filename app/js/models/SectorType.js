angular.module('SectorType', [])

  .factory('SectorType', function (store) {
    return store.defineResource('sectortype');
  })

;
