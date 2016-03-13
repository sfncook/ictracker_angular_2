'use strict';

angular.module("SplashController", ['DataServices', 'IncidentServices', 'DepartmentServices', 'TbarServices', 'AdaptersList', 'ModelsList', 'js-data'])
  .run(function (DataStore) {
    DataStore.init();
  })

  .controller('SplashCtrl', function ($q, $scope, $interval,
                                      LoadAllIncidents, Incidents, LoadIncidentTypes, IncidentTypes,
                                      ResetSavedDepartment,
                                      SaveIncident, DataStore, LoadDefaultTbars, SaveSector) {
    $scope.dataStore = DataStore;

    LoadIncidentTypes().then(function (incidentTypes) {
      $scope.incidentTypes = incidentTypes;
    });

    LoadAllIncidents().then(function (incidents) {
      $scope.incident_list = incidents;
      function hideLoadingSplash() {
        $scope.dataStore.loadSuccess = true;
        $scope.dataStore.waitingToLoad = false;
      }

      $interval(hideLoadingSplash, 1000);
    });

    $scope.incidentObj = DataStore.adapter.CreateNewIncident();

    $scope.userLogout = function () {
      //UserLogout();
      //var urlLink = "login.html";
      //window.location.href = urlLink;
    };

    $scope.redirectAdmin = function () {
      var urlLink = "admin_user.html";
      window.location.href = urlLink;
    };

    // Respond to incident type button click
    $scope.createAndLoadNewIncident = function (incidentType) {
      $scope.incidentObj.incidentType = incidentType;

      // Default value for inc_number
      //if (!$scope.incidentObj.inc_number) {
      //  $scope.incidentObj.inc_number = "[Incident Number]"
      //}
      $scope.incidentObj.inc_startDate = new Date();

      LoadDefaultTbars($scope.incidentObj);

      SaveIncident($scope.incidentObj).then(function (ignoreThis) {
        var promises = [];
        $scope.incidentObj.sectors.forEach(function (sector) {
          promises.push(SaveSector(sector));
        });

        return $q.all(promises);
      }, function (error) {
        console.log("Error saving new incident: " + error);
      }).then(function (ignoreThis) {
        $scope.loadIncident($scope.incidentObj.id);
      });
    };


    $scope.loadIncident = function (incidentId) {
      var urlLink = "incident_form.html?i=" + incidentId + "&adapter=" + DataStore.adapter.adapter_id_str;
      window.location.href = urlLink;
    };

    $scope.deleIncident = function (incident) {
      var response = confirm("Are you sure you want to delete incident " + incident.inc_number + "?");
      if (response == true) {
        incident.destroy({
          success: function (myObject) {
            LoadAllIncidents();
          },
          error: function (myObject, error) {
            console.log("Error:" + error);
            LoadAllIncidents();
          }
        });
      }
    };
  })

  .controller('LoadingSplashDlg', function ($scope, DataStore) {
    $scope.dataStore = DataStore;
  })
;
