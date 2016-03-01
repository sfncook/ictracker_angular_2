var BaseModelObj = {};

function createBaseModelObj() {
  return Object.create(BaseModelObj, {
    fields: {
      value: function () {
        //TODO: Override this method - return an array with list of fields
        return [];
      }
    },
    updateRemoteToLocal: {
      value: function (remoteFields, remoteObj) {
        var localFields = this.fields();
        if (localFields.length == remoteFields.length) {
          for (var i = 0; i < remoteFields.length; i++) {
            var remoteField = remoteFields[i];
            var remoteValue = remoteObj[remoteField];
            var localField = localFields[i];
            this[localField] = remoteValue;
          }
        } else {
          console.error("BaseModelObj.updateRemoteToLocal localFields.length!=remoteFields.length localObj:", this, " remoteObj:", remoteObj);
        }
      }
    }
  });
}

