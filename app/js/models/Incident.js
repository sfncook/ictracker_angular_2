angular.module('Incident', [])

  .factory('Incident', function (store) {
    return store.defineResource('incident');
  })

;
