angular.module('ActionServices', ['DataServices'])

  .factory('ActionTypes', function () {
    return [];
  })

  .factory('LoadActionTypes', function (DataStore) {
    return function (actionTypes) {
      return DataStore.adapter.LoadActionTypes(actionTypes);
    }
  })

  .factory('ToggleActionTypeForUnit', function () {
    return function (unit, actionType) {
      var addedAction = false;
      var relation = unit.relation("actions");
      if (unit.actionsArr) {
        if (unit.actionsArr.indexOf(actionType) >= 0) {
          relation.remove(actionType);
          unit.actionsArr.remByVal(actionType);
          addedAction = false;
        } else {
          relation.add(actionType);
          unit.actionsArr.push(actionType);
          addedAction = true;
        }
      } else {
        // Add unit to sector
        relation.add(actionType);
        if (!unit.actionsArr) {
          unit.actionsArr = [];
        }
        unit.actionsArr.push(actionType);
        addedAction = true;
      }
      return addedAction;
    }
  })

;

