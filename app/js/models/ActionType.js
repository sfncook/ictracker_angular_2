// Default values
var DEFAULT_category = '';      // string
var DEFAULT_incidentType = [];  // string
var DEFAULT_isWarning = false;  // string[]
var DEFAULT_name = '';          // bool


var ActionType = createBaseModelObj();

function createActionType(name,
                          category,
                          incidentType,
                          isWarning
) {
  var actionType = Object.create(ActionType, {
    fields: {
      value: function () {
        return [
          'name',
          'category',
          'incidentType',
          'isWarning'
        ];
      }
    }
  });

  actionType.name = typeof name !== 'undefined' ? name : DEFAULT_name;
  actionType.category = typeof category !== 'undefined' ? category : DEFAULT_category;
  actionType.incidentType = typeof incidentType !== 'undefined' ? incidentType : DEFAULT_incidentType;
  actionType.isWarning = typeof isWarning !== 'undefined' ? isWarning : DEFAULT_isWarning;

  return actionType;
}

function createActionTypeFromObj(remoteFields, remoteObj) {
  var actionType = createActionType();
  actionType.updateRemoteToLocal(remoteFields, remoteObj);
  return actionType;
}


