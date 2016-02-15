
angular.module('DataServices', ['ParseServices', 'AdapterServices'])
    .factory('DefaultCity', function() {
        return "Mesa";
    })

    .factory('DataStore', function() {
        return {
            incident:{},
            currentUser:{},
            waitingToLoad:true,
            loadSuccess:false,
            choosing_unit_for_new_mayday:false
        };
    })

    // Pass this into Parse save commands to log errors.
    .factory('DefaultErrorLogger', [function () {
        return {
            error: function(obj, error) {
                console.log('Failed to create new object, with error code: ' + error.message);
            }
        }
    }])

    .factory('InitDataServices', function (AdapterStore) {
        return function () {
            return AdapterStore.init();
        }
    })

/*****
 * Adapter factories
 */


;
