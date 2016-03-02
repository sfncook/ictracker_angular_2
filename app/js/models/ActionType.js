// Default values
var DEFAULT_category = '';
var DEFAULT_incidentType = [];
var DEFAULT_isWarning = false;
var DEFAULT_name = '';


var ActionType = createBaseModelObj();

function createActionType(name,         // string
                          category,     // string
                          incidentType, // string[]
                          isWarning     // bool
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

// remoteFields: Array of strings - order must match 'fields' value above
function createActionTypeFromObj(remoteFields, remoteObj) {
  var actionType = createActionType();
  actionType.updateRemoteToLocal(remoteFields, remoteObj);
  return actionType;
}


