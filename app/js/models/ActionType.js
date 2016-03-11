angular.module('ActionType', [])

  .factory('ActionType', function (store) {
    return store.defineResource('actiontype');
  })

;

