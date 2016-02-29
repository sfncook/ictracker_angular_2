'use strict';

angular.module("ictApp", ['ngDraggable', 'AdaptersList',
  'DataServices', 'TbarServices', 'ActionServices', 'UnitServices',
  'IncidentServices', 'ReportServices', 'IapServices', 'BranchServices',
  'TimerServices', 'MaydayServices', 'UpgradeServices',
  'ObjectivesServices', 'OSRServices', 'ActionServices', 'SectorServices',
  'UnitServices'])

  .run(function ($q, DataStore, LoadIncident, StartIncidentTimer, StartUnitTimerTimer, UpdateObjectivesPercent) {
    if (!DataStore.init()) {
      var urlLink = "login.html";
      //window.location.href = urlLink;
    }

    //if(!IsLoggedIn()){
    //    ResetSavedDepartment();
    //    var urlLink = "login.html";
    //    window.location.href = urlLink;
    //}


    var incidentObjectId = getHttpRequestByName('i');
    if (incidentObjectId) {
      LoadIncident(incidentObjectId).then(function (incident) {
        //console.log("LoadA afterwards incident:", incident);
        DataStore.loadSuccess = true;
        DataStore.waitingToLoad = false;
        DataStore.incident = incident;
        DataStore.maydays = incident.maydays;
        UpdateObjectivesPercent(incident);
      }).then(function () {
        StartIncidentTimer();
        StartUnitTimerTimer();
      });
    } else {
      console.log("Missing incidentObjectId");
      var urlLink = "splash.html";
      window.location.href = urlLink;
    }
  })

  .filter('range', function () {
    return function (input, total) {
      total = parseInt(total);
      for (var i = 0; i < total; i++) {
        input.push(i);
      }
      return input;
    };
  })

  .controller('LoadingSplashDlg', function ($scope, DataStore) {
    $scope.dataStore = DataStore;
  })

  .controller('HeaderContainer2', function ($scope, DataStore) {
    $scope.dataStore = DataStore;

    $scope.showIncInfoDlg = function () {
      DataStore.showIncInfoDlg();
    }
    $scope.showStrategyDlg = function () {
      DataStore.showStrategyDlg();
    }
  })

  .controller('HeaderContainer', function ($scope, $interval, DataStore) {
    $scope.dataStore = DataStore;
    $scope.osrPerc = 0;
    $scope.objPerc = 0;

    $scope.showUnitsDlgForDispUnits = function () {
      DataStore.showUnitsDlgForDispUnits();
    }

    $scope.showBranchDlg = function () {
      DataStore.showBranchDlg();
    }

    $scope.showCmdXferDlg = function () {
      DataStore.showCmdXferDlg();
    }

    $scope.showReportsDlg = function () {
      DataStore.showReportsDlg();
    }

    $scope.showSettingsDlg = function () {
      DataStore.showSettingsDlg();
    }

    DataStore.setOsrPerc = function (perc) {
      $scope.osrPerc = perc;
    }

    DataStore.setObjPerc = function (perc) {
      $scope.objPerc = perc;
    }

    $scope.userLogout = function () {
      //UserLogout();
      var urlLink = "login.html";
      window.location.href = urlLink;
    }

    $scope.openMap = function () {
      window.open('https://maps.google.com/?daddr=' + encodeURI($scope.dataStore.incident.inc_address), '_blank');
    }

    $scope.clickMoveUnit = function () {
      DataStore.choseMoveUnit = !DataStore.choseMoveUnit;
    }
  })

  .controller('TbarContainer', function ($scope, $filter, DataStore, DoesSectorHavePar, DoesSectorHaveCriticalUnitTimer, AddNewMayday) {

    $scope.openMaydayDlg = function () {
      $("#mayday_dlg").dialog("open");
    }

    $scope.dataStore = DataStore;

    $scope.openChannelDlg = function (sector) {
      DataStore.openChannelDlg(sector);
    }

    $scope.showParDlg = function (sector) {
      DataStore.openParDlg(sector);
    }

    $scope.showSectorNameDlg = function (sector) {
      DataStore.showSectorNameDlg(sector);
    }

    $scope.showBnchDlg = function (sector) {
      DataStore.showBnchDlg(sector);
    }

    $scope.showUnitsDlg = function (sector) {
      DataStore.showUnitsDlg(sector);
    }

    $scope.showUnitsDlgForAcct = function (sector) {
      DataStore.showUnitsDlgForAcct(sector);
    }

    $scope.showActionsDlg = function (unit) {
      DataStore.showActionsDlg(unit);
    }

    $scope.showUnitOptionsDlg = function (unit) {
      DataStore.showUnitOptionsDlg(unit);
    }

    $scope.clickTbarUnit = function (sector, unit) {
      if ($scope.dataStore.choosing_unit_for_new_mayday) {
        AddNewMayday(sector, unit);
        $scope.dataStore.choosing_unit_for_new_mayday = false;
      } else {
        DataStore.showUnitOptionsDlg(unit);
      }
    }

    $scope.sectorParIsSet = function (sector) {
      var sectorPar = $filter('sectorPar')(sector);
      return sectorPar != 'P';
    }

    $scope.doesSectorHavePar = DoesSectorHavePar;

    $scope.doesSectorHaveCriticalUnitTimer = DoesSectorHaveCriticalUnitTimer;

    $scope.getBnchColor = function (sector, bnchIndex) {
      if (sector.sectorType.hasClassicBnch) {
        if (bnchIndex == 1) {
          if (sector.bnchClsUnablePrim) {
            return "benchmark_red";
          } else if (sector.bnchCls1) {
            return "benchmark_green";
          }
        } else if (bnchIndex == 3) {
          if (sector.bnchClsUnableSec) {
            return "benchmark_red";
          } else if (sector.bnchCls3) {
            return "benchmark_green";
          }
        } else {
          if (sector['bnchCls' + bnchIndex]) {
            return "benchmark_green";
          }
        }
      } else if (sector.sectorType.hasVentBnch) {
        if (bnchIndex == 4 && $scope.doesSectorHavePar(sector)) {
          return "benchmark_green";
        } else if (sector['bnchVnt' + bnchIndex]) {
          return "benchmark_green";
        }
      } else if (sector.sectorType.hasIricBnch && sector['bnchIrc' + bnchIndex]) {
        return "benchmark_green";
      } else if (sector.sectorType.hasSafetyBnch && sector['bnchSaf' + bnchIndex]) {
        return "benchmark_green";
      } else if (sector.sectorType.hasTreatmentBnch && sector['bnchTrt' + bnchIndex]) {
        return "benchmark_green";
      } else if (sector.sectorType.hasTriageBnch && sector['bnchTri' + bnchIndex] > 0) {
        return "benchmark_green";
      }
      return "benchmark_black";
    }

    $scope.onDropUnitOnSector = function (drag_data, dest_sector) {
      DataStore.choseMoveUnit = false
      console.log("Drop drag_data:", drag_data, " dest_sector:", dest_sector);
      var unit = drag_data.unit;
      var src_sector = drag_data.src_sector;
      if (dest_sector != src_sector) {
        dest_sector.units.push(unit);
        src_sector.units.remByVal(unit);
      }
      //TODO: Need to save the unit move
    }

  })
  .filter('acctUnitName', function () {
    return function (acctUnit) {
      if (acctUnit) {
        return acctUnit.name;
      } else {
        return "@acct";
      }
    };
  })


  .filter('sectorPar', function () {
    return function (sector) {
      var sectorPar = 0;
      for (var i = 0; i < sector.units.length; i++) {
        var unit = sector.units[i];
        sectorPar += unit.par;
      }
      if (sectorPar == 0) {
        return "P";
      } else {
        return sectorPar;
      }
    };
  })
  .filter('unitPar', function () {
    return function (input, unitPar) {
      if (unitPar != 'P') {
        unitPar = parseInt(unitPar);
        for (var i = 0; i < unitPar; i++)
          input.push(i);
      } else {
        input.push(1);
      }
      return input;
    };
  })

  .controller('ChannelDlg', function ($scope, DataStore, SaveSector) {
    $scope.selectedSector = {};

    $scope.channel_letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
    $scope.channel_numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

    DataStore.openChannelDlg = function (sector) {
      $scope.selectedSector = sector;
      $("#channel-dlg").dialog("open");
    }

    $scope.setChannelLetter = function (channel_letter) {
      $scope.selectedSector.channel_letter = channel_letter;
      SaveSector($scope.selectedSector);
    }

    $scope.setChannelNumber = function (channel_number) {
      $scope.selectedSector.channel_number = channel_number;
      SaveSector($scope.selectedSector);
    }

  })

  .controller('ParDlg', function ($scope, DataStore, DoesSectorHavePar, ReportFunctions, SaveUnit) {
    $scope.selectedSector = {};

    DataStore.openParDlg = function (sector) {
      $scope.selectedSector = sector;
      $("#par-dlg").dialog("open");
    }

    $scope.selectPersonPar = function (unit, i) {
      if (unit.manyPar >= i) {
        unit.manyPar = i - 1;
      } else {
        unit.manyPar = i;
        ReportFunctions.addEvent_person_has_par($scope.selectedSector, unit);
      }
      SaveUnit(unit);
    }

    $scope.selectUnitPar = function (unit) {
      if (unit.manyPar == unit.par) {
        unit.manyPar = 0;
      } else {
        unit.manyPar = unit.par;
      }

      if (unit.manyPar == unit.par) {
        ReportFunctions.addEvent_unit_has_par($scope.selectedSector, unit);
      }

      SaveUnit(unit);
    }

    $scope.selectSectorPar = function () {
      var selectedSector = $scope.selectedSector;
      if (DoesSectorHavePar(selectedSector)) {
        for (var i = 0; i < selectedSector.units.length; i++) {
          var unit = selectedSector.units[i];
          unit.manyPar = 0;
        }
      } else {
        for (var i = 0; i < selectedSector.units.length; i++) {
          var unit = selectedSector.units[i];
          unit.manyPar = unit.par;
        }
        ReportFunctions.addEvent_sector_has_par($scope.selectedSector);
      }

      for (var i = 0; i < selectedSector.units.length; i++) {
        var unit = selectedSector.units[i];
        SaveUnit(unit);
      }
    }

    $scope.showUnitOptionsDlg = function (unit) {
      DataStore.showUnitOptionsDlg(unit);
    }

    $scope.doesSectorHavePar = DoesSectorHavePar;
  })

  .controller('BnchDlg', function ($scope, DataStore, DoesSectorHavePar, SaveSector) {
    $scope.dataStore = DataStore;
    $scope.doesSectorHavePar = DoesSectorHavePar;

    $scope.bnchClsUnablePrim = 'bnchClsUnablePrim';
    $scope.bnchClsUnableSec = 'bnchClsUnableSec';
    $scope.bnchCls1 = 'bnchCls1';
    $scope.bnchCls2 = 'bnchCls2';
    $scope.bnchCls3 = 'bnchCls3';
    $scope.bnchCls4 = 'bnchCls4';
    $scope.bnchCls5 = 'bnchCls5';
    $scope.bnchCls6 = 'bnchCls6';
    $scope.bnchVnt1 = 'bnchVnt1';
    $scope.bnchVnt2 = 'bnchVnt2';
    $scope.bnchVnt3 = 'bnchVnt3';
    $scope.bnchIrc1 = 'bnchIrc1';
    $scope.bnchIrc2 = 'bnchIrc2';
    $scope.bnchIrc3 = 'bnchIrc3';
    $scope.bnchIrc4 = 'bnchIrc4';
    $scope.bnchSaf1 = 'bnchSaf1';
    $scope.bnchSaf2 = 'bnchSaf2';
    $scope.bnchTrt1 = 'bnchTrt1';
    $scope.bnchTrt2 = 'bnchTrt2';
    $scope.bnchTrt3 = 'bnchTrt3';
    $scope.bnchLzo1 = 'bnchLzo1';
    $scope.bnchLzo2 = 'bnchLzo2';
    $scope.bnchLzo3 = 'bnchLzo3';

    DataStore.showBnchDlg = function (sector) {
      $scope.dataStore.selectedSector = sector;
      if (sector.sectorType.hasClassicBnch) {
        $("#bnch_dlg").dialog("open");
      } else if (sector.sectorType.hasVentBnch) {
        $("#bnch_vent_dlg").dialog("open");
      } else if (sector.sectorType.hasIricBnch) {
        $("#bnch_iric_dlg").dialog("open");
      } else if (sector.sectorType.hasSafetyBnch) {
        $("#bnch_safety_dlg").dialog("open");
      } else if (sector.sectorType.hasTreatmentBnch) {
        $("#bnch_treatment_dlg").dialog("open");
      } else if (sector.sectorType.hasTriageBnch) {
        $("#bnch_triage_dlg").dialog("open");
      }
    }

    $scope.selectBnch = function (bnchIndex) {
      $scope.dataStore.selectedSector[bnchIndex] = !$scope.dataStore.selectedSector[bnchIndex];

      switch (bnchIndex) {
        case $scope.bnchClsUnablePrim:
          $scope.dataStore.selectedSector.bnchCls1 = false;
          $scope.dataStore.selectedSector.bnchCls2 = false;
          $scope.dataStore.selectedSector.bnchCls3 = false;
          $scope.dataStore.selectedSector.bnchCls4 = false;
          break;
        case $scope.bnchClsUnableSec:
          $scope.dataStore.selectedSector.bnchCls3 = false;
          $scope.dataStore.selectedSector.bnchCls4 = false;
          break;
        case $scope.bnchCls2:
          $scope.dataStore.selectedSector.bnchClsUnablePrim = false;
          break;
        case $scope.bnchCls4:
          $scope.dataStore.selectedSector.bnchClsUnableSec = false;
          break;
      }

      SaveSector($scope.dataStore.selectedSector);
    }

    $scope.showParDlgFromBnch = function () {
      DataStore.openParDlg($scope.dataStore.selectedSector);
    }

    $scope.onChangeTriage = function () {
      SaveSector($scope.dataStore.selectedSector);
    }

  })

  .controller('UnitsDlg', function ($scope, $http, DataStore, LoadUnitTypes, UnitTypes, DefaultCity, ToggleUnitTypeForSector, ReportFunctions) {
    $scope.selectedSector = {};
    $scope.dataStore = DataStore;
    $scope.forAcct = false;

    $scope.acct_opts = ['N', 'E', 'S', 'W', 'A', 'B', 'C', 'D'];

    $scope.cities = [];
    $scope.type_names = [];

    LoadUnitTypes().then(
      function (unitTypes_) {
        UnitTypes = unitTypes_;
        // In order to eliminate duplicates write everything to objects
        var cities_local = [];
        for (var i = 0; i < UnitTypes.length; i++) {
          var unitType = UnitTypes[i];
          var city = cities_local.putIfAbsent(unitType.city, {'name': unitType.city, 'types': []});
          var type = city.types.putIfAbsent(unitType.type, {'city': unitType.city, 'name': unitType.type, 'units': []});
          type.units.putIfAbsent(unitType.name, unitType);

          if (city.name == DefaultCity) {
            $scope.selected_city = city;
            $scope.selected_type_name = '';
          }
        }//for

        // Convert everything to arrays
        $scope.cities = cities_local.propertiesToArray();
        $scope.cities.forEach(function (city) {
          city.types = city.types.propertiesToArray();
          city.types.forEach(function (type) {
            type.units = type.units.propertiesToArray();
          });
        });
      }
    );

    $scope.selectCity = function (city) {
      $scope.selected_city = city;
    };

    $scope.selectType = function (type) {
      if ($scope.selected_type_name != type.name) {
        $scope.selected_type_name = type.name;
      } else {
        $scope.selected_type_name = '';
      }
    };

    $scope.selectAcctUnitOpt = function (acctUnitOpt) {
      if ($scope.forAcct) {
        $scope.selectedSector.acctUnitOpt = acctUnitOpt;
      }
    };

    $scope.selectUnit = function (unitType) {
      if ($scope.forAcct) {
        $scope.selectedSector.acctUnit = unitType;
        ReportFunctions.addEvent_unitType_to_acct($scope.selectedSector, unitType);
        $("#units_dlg").dialog("close");
        $scope.selectedSector.save(null, {
          error: function (error) {
            console.log('Failed to $scope.selectedSector.save() for acctUnit, with error code: ' + error.message);
          }
        });
      } else if ($scope.forOsr) {
        $scope.dataStore.incident.osr.unit = unitType.name;
        $("#units_dlg").dialog("close");
      } else {
        var wasAdded = ToggleUnitTypeForSector($scope.selectedSector, unitType);
        if (wasAdded) {
          if (!$scope.dataStore.incident.dispatchedUnits.unitTypes.contains(unitType)) {
            $scope.dataStore.incident.dispatchedUnits.unitTypes.push(unitType);
            $scope.dataStore.incident.dispatchedUnits.save(null, {
              error: function (error) {
                console.log('(2) Failed to $scope.dataStore.incident.dispatchedUnits.save() with error code: ' + error.message);
              }
            });
          }

          // Update sector.selectedUnit
          if (!$scope.selectedSector.selectedUnit) {
            $scope.selectedSector.selectedUnit = $scope.selectedSector.units[0];
          }

          var sectorName = $scope.selectedSector.name;
          if (sectorName == "RESCUE") {
            DataStore.setRescue();
          }
          if (sectorName == "Safety") {
            DataStore.setSafety();
          }
          if (sectorName == "On Deck") {
            DataStore.setOnDeck();
          }
          if (sectorName == "ReHab") {
            DataStore.setRehab();
          }
        } else {
          $scope.dataStore.incident.dispatchedUnits.unitTypes.remByVal(unitType);
          $scope.dataStore.incident.dispatchedUnits.save(null, {
            error: function (error) {
              console.log('(3) Failed to $scope.dataStore.incident.dispatchedUnits.save() with error code: ' + error.message);
            }
          });
        }
        $("#units_dlg").dialog("close");
      }
      $scope.forAcct = false;
      $scope.forDispUnits = false;
      $scope.forOsr = false;

    };

    $scope.selectDispatchedUnit = function (unit) {
      if ($scope.forAcct) {
        $scope.selectedSector.setAcctUnit(unit);
        $scope.forAcct = false;
        $("#units_dlg").dialog("close");
      } else {
        $scope.selectUnit(unit);
      }
    };

    DataStore.showUnitsDlg = function (sector) {
      $scope.selectedSector = sector;
      $("#units_dlg").dialog("open");
    }

    DataStore.showUnitsDlgForAcct = function (sector) {
      $scope.forAcct = true;
      DataStore.showUnitsDlg(sector);
    }

    DataStore.showUnitsDlgForDispUnits = function () {
      $scope.forDispUnits = true;
      DataStore.showUnitsDlg();
    }

    DataStore.showUnitsDlgForOsr = function () {
      $scope.forOsr = true;
      DataStore.showUnitsDlg();
    }

    $('#units_dlg').bind('dialogclose', function () {
      $scope.forDispUnits = false;
      $scope.forAcct = false;
    });
  })
  .filter('getUnitPar', function () {
    return function (unitPar) {
      if (unitPar == 0) {
        return "P";
      } else {
        return unitPar;
      }
    };
  })

  .filter('unique_units_by_type', function () {
    return function (units) {
      if (units) {
        var output_units = [];
        angular.forEach(units, function (unit) {
          var is_found = false;
          angular.forEach(output_units, function (out_unit) {
            if (out_unit.type.name == unit.type.name) {
              is_found = true;
            }
          });
          if (is_found) {
            return;
          }
          output_units.push(unit);

        });
        return output_units;
      }
    };
  })

  .controller('ActionsDlg', function ($scope, DataStore, LoadActionTypes, ActionTypes, ToggleActionTypeForUnit, ReportFunctions, SaveUnit) {
    $scope.selectedUnit = {};
    $scope.actionTypes = ActionTypes = [];

    LoadActionTypes($scope.actionTypes);

    $scope.selectAction = function (actionType) {
      ToggleActionTypeForUnit($scope.selectedUnit, actionType);
      SaveUnit($scope.selectedUnit);
      // ReportFunctions.addEvent_action_to_unit([needs sector], $scope.selectedUnit, actionType);
      // if(actionType.name=="Take a Line") {DataStore.estSupply();}
    };

    $scope.getActionTypeCategories = function () {
      var categoriesMap = {};
      for (var i = 0; i < ActionTypes.length; i++) {
        var actionType = ActionTypes[i];
        categoriesMap[actionType.category] = actionType;
      }
      return Object.keys(categoriesMap);
    };

    DataStore.showActionsDlg = function (unit) {
      $scope.selectedUnit = unit;
      $("#actions_dlg").dialog("open");
    }

    $scope.unitContainsActionType = function (unit, actionTypeSrc) {
      if (unit && unit.actionsArr) {
        for (var i = 0; i < unit.actionsArr.length; i++) {
          var actionTypeDst = unit.actionsArr[i];
          if (actionTypeDst.name && actionTypeSrc.name) {
            if (actionTypeDst.name == actionTypeSrc.name) {
              return true;
            }
          }
        }
      }
      return false;
    }
  })

  .controller('IncInfoDlg', function ($scope, DataStore, SaveIncident) {
    $scope.inc_address = '';
    $scope.inc_number = '';

    DataStore.showIncInfoDlg = function () {
      $scope.inc_address = DataStore.incident.inc_address;
      $scope.inc_number = DataStore.incident.inc_number;
      $("#incident_info_dlg").dialog("open");
    }

    $scope.clickOk = function () {
      DataStore.incident.inc_address = $scope.inc_address;
      DataStore.incident.inc_number = $scope.inc_number;
      SaveIncident(DataStore.incident);
      $("#incident_info_dlg").dialog("close");
    }

    $scope.clickCancel = function () {
      $("#incident_info_dlg").dialog("close");
    }

    $scope.clickAddressClear = function () {
      $scope.inc_address = "";
    }
    $scope.clickNumberClear = function () {
      $scope.inc_number = "";
    }
  })

  .controller('BranchDlg', function ($scope, DataStore, LoadIncidentTypes, IncidentTypes, CreateBranch) {

    LoadIncidentTypes();
    $scope.incidentTypes = IncidentTypes;

    $scope.users = [
      {"name": "Bob Smith"},
      {"name": "John Jones"},
      {"name": "Sally Smith"},
      {"name": "Jeff Bridges"}
    ];

    DataStore.showBranchDlg = function () {
      $("#branch_dlg").dialog("open");
    }

    $scope.clickCancel = function () {
      $("#branch_dlg").dialog("close");
    }

    $scope.createBranch = function (incidentType) {
      $("#branch_dlg").dialog("close");
      CreateBranch($scope.branch_user, incidentType);
    }
  })

  .controller('SettingsDlg', function ($scope, DataStore) {

    DataStore.showSettingsDlg = function () {
      $("#settings_dlg").dialog("open");
    }

    $scope.clickCancel = function () {
      $("#settings_dlg").dialog("close");
    }

    $scope.userLogout = function () {
      //UserLogout();
      var urlLink = "login.html";
      window.location.href = urlLink;
    }

    $scope.redirectIncidentPage = function () {
      var urlLink = "splash.html";
      window.location.href = urlLink;
    }
  })

  .controller('CmdXferDlg', function ($scope, DataStore) {
    $scope.upgrade_primary = 0;
    $scope.upgrade_secondary = 0;

    DataStore.showCmdXferDlg = function () {
      $("#cmdxfer_dialog").dialog("open");
    }
  })


  .controller('AddressDlg', function ($scope, DataStore) {

    $scope.address = '';

    DataStore.showAddressDlg = function () {
      $scope.address = DataStore.getDispAddress();
      if ($scope.address == 'Dispatch Address') $scope.address = '';
      $("#address_dialog").dialog("open");
    }

    $scope.clickOk = function () {
      var addy = $scope.address;
      if (addy == '') addy = 'Dispatch Address';
      DataStore.setDispAddress(addy);
      $("#address_dialog").dialog("close");
    }

    $scope.clickCancel = function () {
      $("#address_dialog").dialog("close");
    }

    $scope.clickClear = function () {
      $scope.address = "";
    }
  })

  .controller('ObjectivesDlg', function ($scope, DataStore) {

    function updatePerc() {
      var count = 0;
      if ($scope.obj_upgd) {
        count++;
      }
      if ($scope.obj_safe) {
        count++;
      }
      if ($scope.obj_estb) {
        count++;
      }
      if ($scope.obj_utes) {
        count++;
      }
      if ($scope.obj_vent) {
        count++;
      }
      if ($scope.obj_deck) {
        count++;
      }
      if ($scope.obj_pres) {
        count++;
      }
      if ($scope.obj_moni) {
        count++;
      }
      if ($scope.obj_salv) {
        count++;
      }
      if ($scope.obj_rehb) {
        count++;
      }
      if ($scope.obj_srvc) {
        count++;
      }
      var perc = Math.ceil((count * 100) / 11)
      DataStore.setObjPerc(perc);
    }

    $scope.$watch('obj_upgd', function () {
      updatePerc();
    });
    $scope.$watch('obj_safe', function () {
      updatePerc();
    });
    $scope.$watch('obj_estb', function () {
      updatePerc();
    });
    $scope.$watch('obj_utes', function () {
      updatePerc();
    });
    $scope.$watch('obj_vent', function () {
      updatePerc();
    });
    $scope.$watch('obj_deck', function () {
      updatePerc();
    });
    $scope.$watch('obj_pres', function () {
      updatePerc();
    });
    $scope.$watch('obj_moni', function () {
      updatePerc();
    });
    $scope.$watch('obj_salv', function () {
      updatePerc();
    });
    $scope.$watch('obj_rehb', function () {
      updatePerc();
    });
    $scope.$watch('obj_srvc', function () {
      updatePerc();
    });

    DataStore.setCustSvcSector = function () {
      $scope.obj_srvc = true;
      updatePerc();
    }

    DataStore.estSupply = function () {
      $scope.obj_estb = true;
      updatePerc();
    }

    DataStore.setRescue = function () {
      $scope.obj_upgd = true;
      updatePerc();
    }

    DataStore.setSafety = function () {
      $scope.obj_safe = true;
      updatePerc();
    }

    DataStore.setOnDeck = function () {
      $scope.obj_deck = true;
      updatePerc();
    }

    DataStore.setRehab = function () {
      $scope.obj_rehb = true;
      updatePerc();
    }
  })

  .controller('UnitOptionsDlg', function ($scope, DataStore, UpdateUnitTimer, SaveUnit) {
    $scope.pars = [1, 2, 3, 4, 5];
    $scope.psis = [];
    $scope.selected_unit = {};

    for (var psiValue = 4500; psiValue >= 0; psiValue -= 100) {
      $scope.psis.push(psiValue);
    }

    DataStore.showUnitOptionsDlg = function (unit) {
      $scope.selected_unit = unit;
      $("#unit_options_dlg").dialog("open");
    }

    $scope.selectPar = function (par) {
      var unit = $scope.selected_unit;
      unit.par = par;
      if (unit.par < unit.manyPar) {
        unit.manyPar = unit.par;
      }
      SaveUnit(unit);
      $("#unit_options_dlg").dialog("close");
    }

    $scope.selectPsi = function (psi) {
      $scope.selected_unit.psi = psi;
      SaveUnit($scope.selected_unit);
      $("#unit_options_dlg").dialog("close");
    }

    $scope.resetClock = function () {
      $scope.selected_unit.timer_start = new Date();
      UpdateUnitTimer($scope.selected_unit);
      SaveUnit($scope.selected_unit);
      $("#unit_options_dlg").dialog("close");
    }

  })

  .controller('PsiDlg', function ($scope, DataStore) {
    $scope.psis = [];
    $scope.selected_unit = 0;

    for (var psiValue = 4500; psiValue >= 0; psiValue -= 100) {
      $scope.psis.push(psiValue);
    }

    // selectPsiCallback = function to callback with selected psi(string) as argument
    DataStore.showPsiDlg = function (selectPsiCallback) {
      $scope.selectPsiCallback = selectPsiCallback;
      $("#psi_dlg").dialog("open");
    }

    $scope.selectPsi = function (psi) {
      if ($scope.selectPsiCallback) {
        $scope.selectPsiCallback(psi);
      }
      $("#psi_dlg").dialog("close");
    }

  })

  .factory('SetBeforeDialogClose', [function () {
    return function (func) {
      beforeDialogCloseFunc = func;
    }
  }])
  .factory('ClearBeforeDialogClose', [function () {
    return function () {
      beforeDialogCloseFunc = 0;
    }
  }])


;


function initDialogs() {
  $(".dialog").dialog({
    autoOpen: false,
    modal: true
  });
  $("#sector_name_dlg").dialog({
    resizable: false,
    modal: true,
    width: 940,
    open: function () {
      jQuery('.ui-widget-overlay').bind('click', function () {
        jQuery('#sector_name_dlg').dialog('close');
      })
    }
  });
  $("#channel-dlg").dialog({
    resizable: false,
    modal: true,
    width: 350,
    open: function () {
      jQuery('.ui-widget-overlay').bind('click', function () {
        jQuery('#channel-dlg').dialog('close');
      })
    }
  });
  $("#par-dlg").dialog({
    resizable: false,
    modal: true,
    width: 839,
    open: function () {
      jQuery('.ui-widget-overlay').bind('click', function () {
        jQuery('#par-dlg').dialog('close');
      })
    }
  });
  $("#bnch_dlg").dialog({
    resizable: false,
    width: 343,
    modal: true,
    open: function () {
      jQuery('.ui-widget-overlay').bind('click', function () {
        jQuery('#bnch_dlg').dialog('close');
      })
    }
  });
  $("#bnch_vent_dlg").dialog({
    resizable: false,
    width: 300,
    modal: true,
    open: function () {
      jQuery('.ui-widget-overlay').bind('click', function () {
        jQuery('#bnch_vent_dlg').dialog('close');
      })
    }
  });
  $("#bnch_iric_dlg").dialog({
    resizable: false,
    width: 250,
    modal: true,
    open: function () {
      jQuery('.ui-widget-overlay').bind('click', function () {
        jQuery('#bnch_iric_dlg').dialog('close');
      })
    }
  });
  $("#bnch_safety_dlg").dialog({
    resizable: false,
    width: 250,
    modal: true,
    open: function () {
      jQuery('.ui-widget-overlay').bind('click', function () {
        jQuery('#bnch_safety_dlg').dialog('close');
      })
    }
  });
  $("#bnch_treatment_dlg").dialog({
    resizable: false,
    width: 250,
    modal: true,
    open: function () {
      jQuery('.ui-widget-overlay').bind('click', function () {
        jQuery('#bnch_treatment_dlg').dialog('close');
      })
    }
  });
  $("#bnch_triage_dlg").dialog({
    resizable: false,
    width: 250,
    modal: true,
    open: function () {
      jQuery('.ui-widget-overlay').bind('click', function () {
        jQuery('#bnch_triage_dlg').dialog('close');
      })
    }
  });
  $("#units_dlg").dialog({
    resizable: false,
    modal: true,
    width: 855,
    open: function () {
      jQuery('.ui-widget-overlay').bind('click', function () {
        jQuery('#units_dlg').dialog('close');
      })
    }
  });
  $("#actions_dlg").dialog({
    resizable: false,
    modal: true,
    width: 810,
    open: function () {
      jQuery('.ui-widget-overlay').bind('click', function () {
        jQuery('#actions_dlg').dialog('close');
      })
    }
  });
  $("#cmdxfer_dialog").dialog({
    resizable: false,
    modal: true,
    width: 350,
    open: function () {
      jQuery('.ui-widget-overlay').bind('click', function () {
        jQuery('#cmdxfer_dialog').dialog('close');
      })
    }
  });
  $("#upgrade_dlg").dialog({
    resizable: false,
    modal: true,
    width: 485,
    open: function () {
      jQuery('.ui-widget-overlay').bind('click', function () {
        jQuery('#upgrade_dlg').dialog('close');
      })
    }
  });
  $("#osr_dlg").dialog({
    resizable: false,
    modal: true,
    width: 460,
    close: function (event, ui) {
      angular.element('#osr_dlg').scope().dataStore.incident.osr.save();
    },
    open: function () {
      jQuery('.ui-widget-overlay').bind('click', function () {
        jQuery('#osr_dlg').dialog('close');
      })
    }

  });
  $("#dispatch_address_dlg").dialog({
    resizable: false,
    modal: true,
    width: 450,
    open: function () {
      jQuery('.ui-widget-overlay').bind('click', function () {
        jQuery('#dispatch_address_dlg').dialog('close');
      })
    }
  });
  $("#objectives_dlg").dialog({
    resizable: false,
    modal: true,
    width: 230,
    close: function (event, ui) {
      angular.element('#objectives_dlg').scope().dataStore.incident.objectives.save();
    },
    open: function () {
      jQuery('.ui-widget-overlay').bind('click', function () {
        jQuery('#objectives_dlg').dialog('close');
      })
    }
  });
  $("#iap_dlg").dialog({
    resizable: false,
    modal: true,
    width: 616,
    close: function (event, ui) {
      angular.element('#iap_dlg').scope().dataStore.incident.iap.save();
    },
    open: function () {
      jQuery('.ui-widget-overlay').bind('click', function () {
        jQuery('#iap_dlg').dialog('close');
      })
    }
  });
  $("#unit_options_dlg").dialog({
    resizable: false,
    modal: true,
    width: 575,
    open: function () {
      jQuery('.ui-widget-overlay').bind('click', function () {
        jQuery('#unit_options_dlg').dialog('close');
      })
    }
  });
  $("#psi_dlg").dialog({
    resizable: false,
    modal: true,
    width: 423,
    open: function () {
      jQuery('.ui-widget-overlay').bind('click', function () {
        jQuery('#psi_dlg').dialog('close');
      })
    }
  });
  $("#address_dialog").dialog({
    resizable: false,
    modal: true,
    width: 450,
    open: function () {
      jQuery('.ui-widget-overlay').bind('click', function () {
        jQuery('#address_dialog').dialog('close');
      })
    }
  });
  $("#reports_dlg").dialog({
    resizable: false,
    modal: true,
    width: 820,
    open: function () {
      jQuery('.ui-widget-overlay').bind('click', function () {
        jQuery('#reports_dlg').dialog('close');
      })
    }
  });
  $("#clear_mayday_dlg").dialog({
    resizable: false,
    modal: true,
    width: 348,
    open: function () {
      jQuery('.ui-widget-overlay').bind('click', function () {
        jQuery('#clear_mayday_dlg').dialog('close');
      })
    }
  });
  $("#incident_info_dlg").dialog({
    resizable: false,
    modal: true,
    width: 450,
    open: function () {
      jQuery('.ui-widget-overlay').bind('click', function () {
        jQuery('#incident_info_dlg').dialog('close');
      })
    }
  });
  $("#branch_dlg").dialog({
    resizable: false,
    modal: true,
    width: 550,
    open: function () {
      jQuery('.ui-widget-overlay').bind('click', function () {
        jQuery('#branch_dlg').dialog('close');
      })
    }
  });
  $("#strategy_dlg").dialog({
    resizable: false,
    modal: true,
    width: 258,
    open: function () {
      jQuery('.ui-widget-overlay').bind('click', function () {
        jQuery('#strategy_dlg').dialog('close');
      })
    }
  });
  $("#settings_dlg").dialog({
    resizable: false,
    modal: true,
    width: 258,
    open: function () {
      jQuery('.ui-widget-overlay').bind('click', function () {
        jQuery('#settings_dlg').dialog('close');
      })
    }
  });
  $("#osr_dlg").dialog({
    resizable: false,
    modal: true,
    width: 460,
    close: function (event, ui) {
      angular.element('#osr_dlg').scope().dataStore.incident.osr.save();
    },
    open: function () {
      jQuery('.ui-widget-overlay').bind('click', function () {
        jQuery('#osr_dlg').dialog('close');
      })
    }
  });
  $("#mayday_dlg").dialog({
    resizable: false,
    modal: true,
    width: 400,
    close: function (event, ui) {
      var dataStore = angular.element('#osr_dlg').scope().dataStore;
      dataStore.saveSelectedMayday();
    },
    open: function () {
      jQuery('.ui-widget-overlay').bind('click', function () {
        jQuery('#mayday_dlg').dialog('close');
      })
    }
  });

  $(".ui-dialog .ui-dialog-titlebar-close").html("Close");

  $(".dialog").on("dialogbeforeclose", function (event, ui) {
    if (nextDialogEl) {
      nextDialogEl.dialog('open');
    }

    if (beforeDialogCloseFunc) {
      beforeDialogCloseFunc();
      beforeDialogCloseFunc = 0;
    }
  });

}
var nextDialogEl; // DOM element - sequentially open dialogs
var beforeDialogCloseFunc; // function
$(document).ready(initDialogs);
