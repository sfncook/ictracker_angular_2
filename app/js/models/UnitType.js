angular.module('UnitType', [])

  .factory('UnitType', function (store) {
    return store.defineResource('unittype');
  })

;
