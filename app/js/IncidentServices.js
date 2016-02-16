
angular.module('IncidentServices', ['DataServices'])

    .factory('IncidentTypes', function() {
        return new Array();
    })

    .controller('StrategyDlg', function($scope, $http, DataStore){
        $scope.dataStore = DataStore;
        DataStore.showStrategyDlg=function(){
            $("#strategy_dlg").dialog('open');
        }
        $scope.setStrategy = function(strategyType){
            DataStore.incident.strategy = strategyType;
            DataStore.incident.save();
            $("#strategy_dlg").dialog('close');
        }
    })

    .factory('LoadIncident', function (DataAdapter) {
        return function (incidentObjectId) {
            return DataAdapter.adapter.LoadIncident(incidentObjectId);
        }
    })
    .factory('LoadAllIncidents', function (DataAdapter) {
        return function () {
            return DataAdapter.adapter.LoadAllIncidents();
        }
    })
    .factory('LoadIncidentTypes', function (DataAdapter) {
        return function () {
            return DataAdapter.adapter.LoadIncidentTypes();
        }
    })

    .factory('UpdateIncidentAsNeeded', function (DataAdapter) {
        return function (incidentObjectId) {
            return DataAdapter.adapter.UpdateIncidentAsNeeded();
        }
    })

    .factory('Incidents', function() {
        return [];
    })

    .factory('SaveIncident', function (DataAdapter) {
        return function (incident) {
            return DataAdapter.adapter.SaveIncident(incident);
        }
    })

    .factory('CreateNewIncident', function (DataAdapter) {
        return function () {
            var incidentObject = DataAdapter.adapter.CreateNewIncident();
            incidentObject.inc_number = "";
            incidentObject.inc_address = "";
            incidentObject.strategy = "";
            return incidentObject;
        }
    })

    .filter('sortIncTypeByOrder', function(){
        return function(array) {
            if(array) {
                array.sort(function(a, b){
                    return a.order - b.order;
                });
            }
            return array;
        }
    })

;


