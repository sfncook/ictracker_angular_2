angular.module('SectorServices', ['DataServices'])

  .factory('SectorTypes', function () {
    return [];
  })

  .controller('SectorNamesDlg', function ($scope, $http, DataStore, ReportFunctions, LoadSectorTypes, SectorTypes, CreateBlankSectorType, SaveSector) {
    $scope.selectedSector = {};
    $scope.dataStore = DataStore;

    LoadSectorTypes().then(
      function (sectorTypes) {
        // Make all sector_types visible
        for (var i = 0; i < SectorTypes.length; i++) {
          SectorTypes[i].isVisible = true;
        }

        var orderedSectorTypes = [
          SectorTypes.INTERIOR, SectorTypes.SECTOR_1, SectorTypes.ALPHA_SECTOR, SectorTypes.SALVAGE, SectorTypes.TRIAGE,
          SectorTypes.VENTILATION, SectorTypes.SECTOR_2, SectorTypes.BRAVO_SECTOR, SectorTypes.OVERHAUL, SectorTypes.EXTRICATION,
          SectorTypes.ROOF, SectorTypes.SECTOR_3, SectorTypes.CHARLIE_SECTOR, SectorTypes.EVACUATION, SectorTypes.TREATMENT,
          SectorTypes.ON_DECK, SectorTypes.SECTOR_4, SectorTypes.DELTA_SECTOR, SectorTypes.CUSTOMER_SERVICE, SectorTypes.TRANSPORTATION,
          SectorTypes.STAGING, SectorTypes.SECTOR_5, CreateBlankSectorType(), CreateBlankSectorType(), CreateBlankSectorType(),
          CreateBlankSectorType(), SectorTypes.SECTOR_6, SectorTypes.NORTH_SECTOR, SectorTypes.REHAB, SectorTypes.LZ,
          SectorTypes.IRIC, SectorTypes.SECTOR_7, SectorTypes.EAST_SECTOR, SectorTypes.LOBBY, CreateBlankSectorType(),
          SectorTypes.RIC, SectorTypes.SECTOR_8, SectorTypes.SOUTH_SECTOR, SectorTypes.RESOURCE, CreateBlankSectorType(),
          SectorTypes.RESCUE, SectorTypes.SECTOR_9, SectorTypes.WEST_SECTOR, SectorTypes.ACCOUNTABILITY, CreateBlankSectorType(),
          SectorTypes.SAFETY, SectorTypes.SECTOR_NUM

        ];

        $scope.OrderedSectorTypes = orderedSectorTypes;
      }
    );

    $scope.sector_dir_btns = [
      {"dialog": "Sub", "tbar": "Sub", "isWide": true},
      {"dialog": "N", "tbar": "North", "isWide": false},
      {"dialog": "E", "tbar": "East", "isWide": false},
      {"dialog": "S", "tbar": "South", "isWide": false},
      {"dialog": "W", "tbar": "West", "isWide": false}
    ];
    $scope.sector_num_btns = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

    $scope.selectSectorType = function (sectorType) {
      $scope.selectedSector.sectorType = sectorType;
      $scope.selectedSector.initialized = true;
      SaveSector($scope.selectedSector);

      if (sectorType.name == "Customer Service") {
        //DataStore.setCustSvcSector();
      }

      ReportFunctions.addEvent_title_to_sector($scope.selectedSector);

      $("#sector_name_dlg").dialog("close");
    };
    $scope.setDir = function (sector_dir) {
      $scope.selectedSector.direction = sector_dir.tbar;
      SaveSector($scope.selectedSector);
    };
    $scope.setNum = function (sector_num) {
      $scope.selectedSector.number = sector_num;
      SaveSector($scope.selectedSector);
    };

    $scope.isSectorTypeSelected = function (sectorType) {
      console.log("sectorType:", sectorType);
    }

    DataStore.showSectorNameDlg = function (sector) {
      $scope.selectedSector = sector;
      $("#sector_name_dlg").dialog("open");
    }
  })

  .factory('LoadSectorTypes', function (DataStore, SectorTypes) {
    return function () {
      return DataStore.adapter.LoadSectorTypes().then(function (sectorTypes) {
        SectorTypes.removeAll();
        for (var i = 0; i < sectorTypes.length; i++) {
          var sectorType = sectorTypes[i];
          var nameRefor = sectorType.name.replace(" ", "_").toUpperCase();
          SectorTypes[nameRefor] = sectorType;
          if (sectorType.name == "Sector Name") {
            SectorTypes.DEFAULT_SECTOR_TYPE = sectorType;
          }
          if (sectorType.name == "Sector ####") {
            SectorTypes.SECTOR_NUM = sectorType;
          }
          SectorTypes.push(sectorType);
        }//for
        return SectorTypes;
      });
    }
  })

  .factory('SaveSector', function (DataStore) {
    return function (sector) {
      DataStore.dirtyData = true;
      sector.dirty = true;
      return DataStore.adapter.SaveSector(sector).then(
        function() {
          DataStore.dirtyData = false;
          sector.dirty = false;
        }
      );
    }
  })

  .factory('DoesSectorHavePar', [function () {
    return function (sector) {
      var allParsAreZero = true;
      if (sector && sector.units) {
        for (var i = 0; i < sector.units.length; i++) {
          var unit = sector.units[i];
          if (unit.manyPar < unit.par) {
            return false;
          }
          if (unit.par != 0) {
            allParsAreZero = false;
          }
        }
        if (allParsAreZero) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    }
  }])

  .factory('DoesSectorHaveCriticalUnitTimer', function () {
    return function (sector) {
      var allParsAreZero = true;
      if(sector && sector.units) {
        for(var i=0; i<sector.units.length; i++) {
          var unit = sector.units[i];
          if(unit.timer_perc<15) {
            return true;
          }
        }//for
      }
      return false;
    }
  })

  .factory('UpdateUnitsForSector', function () {
    return function ($scope, sector) {
      //for(var i=0; i<sector.units.length; i++) {
      //    var unit = sector.units[i];
      //    unit.fetch({
      //        success:function(unit) {
      //            FetchTypeForUnit(unit);
      //            LoadActionsForUnit(unit);
      //        },
      //        error: function(error) {
      //            console.log('Failed to UpdateUnitsForSector, with error code: ' + error.message);
      //        }
      //    });
      //}
    }
  })

  .factory('SaveSector', function (DataStore) {
    return function (sector) {
      return DataStore.adapter.SaveSector(sector);
    }
  })

//var SECTOR_DEF = ['sectorType', 'direction', 'number', 'orderIndex', 'row', 'col', 'incident', 'acctUnit', 'acctUnitOpt', 'bnchClsUnablePrim', 'bnchClsUnableSec', 'bnchCls1', 'bnchCls2', 'bnchCls3', 'bnchCls4', 'bnchVnt1', 'bnchVnt2', 'bnchVnt3', 'bnchIrc1', 'bnchIrc2', 'bnchIrc3', 'bnchIrc4', 'bnchSaf1', 'bnchSaf2', 'bnchTrt1', 'bnchTrt2', 'bnchTrt3', 'bnchLzo1', 'bnchLzo2', 'bnchLzo3', 'bnchTri1', 'bnchTri2', 'bnchTri3', 'initialized', 'channel_letter', 'channel_number'];
  .factory('UpdateSectorWithSector', function (DataStore) {
    return function (sector) {
      DataStore.incident.inc_number = incident.inc_number;
      DataStore.incident.inc_address = incident.inc_address;
      DataStore.incident.strategy = incident.strategy;
      DataStore.incident.txid = incident.txid;
    }
  })
;

