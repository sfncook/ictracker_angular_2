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
      return DataStore.adapter.LoadSectorTypes(SectorTypes).then(function () {
        for (var i = 0; i < SectorTypes.length; i++) {
          var sectorType = SectorTypes[i];
          var nameRefor = SectorTypes[i].name.replace(" ", "_").toUpperCase();
          SectorTypes[nameRefor] = sectorType;
          if (SectorTypes[i].name == "Sector Name") {
            SectorTypes[i].DEFAULT_SECTOR_TYPE = sectorType;
          }
          if (SectorTypes[i].name == "Sector ####") {
            SectorTypes[i].SECTOR_NUM = sectorType;
          }
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

  .factory('DeepCopySectorToSector', function (DeepCopyUnitToUnit) {
    return function (src_sector, dst_sector) {
      dst_sector.sectorType = src_sector.sectorType;
      dst_sector.direction = src_sector.direction;
      dst_sector.number = src_sector.number;
      dst_sector.orderIndex = src_sector.orderIndex;
      dst_sector.acctUnit = src_sector.acctUnit;
      dst_sector.acctUnitOpt = src_sector.acctUnitOpt;
      dst_sector.bnchClsUnablePrim = src_sector.bnchClsUnablePrim;
      dst_sector.bnchClsUnableSec = src_sector.bnchClsUnableSec;
      dst_sector.bnchCls1 = src_sector.bnchCls1;
      dst_sector.bnchCls2 = src_sector.bnchCls2;
      dst_sector.bnchCls3 = src_sector.bnchCls3;
      dst_sector.bnchCls4 = src_sector.bnchCls4;
      dst_sector.bnchVnt1 = src_sector.bnchVnt1;
      dst_sector.bnchVnt2 = src_sector.bnchVnt2;
      dst_sector.bnchVnt3 = src_sector.bnchVnt3;
      dst_sector.bnchIrc1 = src_sector.bnchIrc1;
      dst_sector.bnchIrc2 = src_sector.bnchIrc2;
      dst_sector.bnchIrc3 = src_sector.bnchIrc3;
      dst_sector.bnchIrc4 = src_sector.bnchIrc4;
      dst_sector.bnchSaf1 = src_sector.bnchSaf1;
      dst_sector.bnchSaf2 = src_sector.bnchSaf2;
      dst_sector.bnchTrt1 = src_sector.bnchTrt1;
      dst_sector.bnchTrt2 = src_sector.bnchTrt2;
      dst_sector.bnchTrt3 = src_sector.bnchTrt3;
      dst_sector.bnchLzo1 = src_sector.bnchLzo1;
      dst_sector.bnchLzo2 = src_sector.bnchLzo2;
      dst_sector.bnchLzo3 = src_sector.bnchLzo3;
      dst_sector.bnchTri1 = src_sector.bnchTri1;
      dst_sector.bnchTri2 = src_sector.bnchTri2;
      dst_sector.bnchTri3 = src_sector.bnchTri3;
      dst_sector.initialized = src_sector.initialized;
      dst_sector.channel_letter = src_sector.channel_letter;
      dst_sector.channel_number = src_sector.channel_number;
      var units_src = src_sector.units;
      var units_dst = dst_sector.units;
      for(var i=0; i<units_src.length; i++) {
        var unit_src = units_src[i];
        var unit_dst = units_dst[i];
        DeepCopyUnitToUnit(unit_src, unit_dst);
      }
    }
  })
;

