angular.module('TbarServices', ['DataServices', 'SectorServices'])

    .factory('TbarSectors', function() {
        return new Array();
    })

    .factory('GridsterOpts', function () {
        var window_width = $(window).width();
        var window_height = $(window).height();
        var tbar_width = 290;
        var tbar_height = 300;
        var header_width = 100;
        var col_count = Math.floor((window_width - header_width) / tbar_width);
        var init_row_count = Math.floor(window_height / tbar_height);
        init_row_count = Math.max(init_row_count, 3);
        var left_margin = Math.floor((window_width - (col_count * tbar_width) - header_width ) / 2);

        return {
            rows: init_row_count,
            columns: col_count,
            margins: [10, 10],
            outerMargin: true,
            colWidth: tbar_width,
            rowHeight: tbar_height,
            defaultSizeX: 1,
            draggable: {enabled: false},
            resizable: {enabled: false}
        };
    })

    .factory('LoadDefaultTbars', function (DataStore, GridsterOpts, SectorTypes) {
        return function (incident) {
            incident.sectors = new Array();

            var orderIndex = 0;
            for(var row=0; row<GridsterOpts.rows; row++) {
                for(var col=0; col<GridsterOpts.columns; col++) {
                    var sector = DataStore.adapter.CreateNewSector();
                    if( orderIndex == 0 ) {
                        sector.sectorType = SectorTypes.RESCUE;
                        sector.initialized = true;
                    } else if( orderIndex == 1 ) {
                        sector.sectorType = SectorTypes.REHAB;
                        sector.initialized = true;
                    } else if( orderIndex == 2 ) {
                        sector.sectorType = SectorTypes.SAFETY;
                        sector.initialized = true;
                    } else {
                        sector.sectorType = SectorTypes.DEFAULT_SECTOR_TYPE;
                        sector.initialized = false;
                    }
                    sector.row = row;
                    sector.col = col;
                    sector.orderIndex = orderIndex++;
                    sector.incident = incident;
                    incident.sectors.push(sector);
                }
            }//for
        }
    })

    .factory('AddTbar', ['TbarSectors', function (TbarSectors) {
        return function (newSector) {
            TbarSectors.push(newSector);
        }
    }])

    .factory('SaveTbars', ['TbarSectors', 'DefaultErrorLogger', function (TbarSectors, DefaultErrorLogger) {
        return function () {
            for(var i=0; i<TbarSectors.length; i++) {
                var sector = TbarSectors[i];
                sector.save(null, DefaultErrorLogger);
            }
        }
    }])

    .factory('CreateBlankSectorType', function (DataStore) {
        return function () {
            var BLANK_SECTOR_TYPE = DataStore.adapter.CreateNewSectorType();
            BLANK_SECTOR_TYPE.isVisible = false;
            return BLANK_SECTOR_TYPE;
        }
    })

    .factory('ToggleUnitTypeForSector', function (DataStore, ReportFunctions) {
        return function (sector, unitType) {
            if(sector.units) {
                // search for unitType already in sector
                for(var i=0; i<sector.units.length; i++) {
                    var unit = sector.units[i];
                    if(unit.type.name==unitType.name) {
                        sector.units.remByVal(unit);
                        DataStore.adapter.DeleteUnit();
                        return false;
                    }
                }//for
            } else {
                // Add unit to sector
                sector.units = [];
            }
            var newUnit = DataStore.adapter.CreateNewUnit(sector, unitType);
            sector.units.push(newUnit);
            ReportFunctions.addEvent_unit_to_sector(sector, newUnit);
            return true;
        }
    })

    /*
     * This is a getter, do not count on the array to be updated dynamically.
     */
    .factory('GetIncidentUnits', ['TbarSectors', function (TbarSectors) {
        return function () {
            var incidentUnits = new Array();
            for(var t=0; t<TbarSectors.length; t++) {
                var sector = TbarSectors[t];
                for(var u=0; u<sector.units.length; u++) {
                    var unit = sector.units[u];
                    incidentUnits.push(unit);
                }
            }//for
            return incidentUnits;
        }
    }])

;
