var DEPARTMENT_DEF = ['name_short', 'name_long', 'app_key', 'js_key'];
var INCIDENT_DEF = ['inc_number', 'inc_address', 'incidentType', 'inc_startDate', 'strategy', 'txid'];
var INCIDENT_TYPE_DEF = ['icon', 'nameLong', 'nameShort', 'order'];
var SECTOR_DEF = ['sectorType', 'direction', 'number', 'orderIndex', 'row', 'col', 'incident', 'acctUnit', 'acctUnitOpt', 'bnchClsUnablePrim', 'bnchClsUnableSec', 'bnchCls1', 'bnchCls2', 'bnchCls3', 'bnchCls4', 'bnchVnt1', 'bnchVnt2', 'bnchVnt3', 'bnchIrc1', 'bnchIrc2', 'bnchIrc3', 'bnchIrc4', 'bnchSaf1', 'bnchSaf2', 'bnchTrt1', 'bnchTrt2', 'bnchTrt3', 'bnchLzo1', 'bnchLzo2', 'bnchLzo3', 'bnchTri1', 'bnchTri2', 'bnchTri3', 'initialized', 'channel_letter', 'channel_number'];
var SECTOR_TYPE_DEF = ['name', 'manyBenchmarkBars', 'hasAcctBtn', 'hasActions', 'hasClock', 'hasPsiBtn', 'isVisible', 'hasClassicBnch', 'hasVentBnch', 'hasIricBnch', 'hasSafetyBnch', 'hasTreatmentBnch', 'hasLzBnch', 'hasTriageBnch'];
var UNIT_TYPE_DEF = ['name', 'type', 'city'];
var UNIT_DEF = ['actions', 'manyPeople', 'manyPar', 'par', 'psi', 'sector', 'type', 'timer_start', 'timer_running'];
var ACTION_TYPE_DEF = ['name', 'category', 'incidentType', 'isWarning'];
var UPGRADE_DEF = ['incident', 'isWorkingFire', 'is1stAlarm', 'is2ndAlarm', 'is3rdAlarm', 'is4thAlarm', 'isBalanceTo', 'isEnRoute'];
var MAYDAY_DEF = ['incident', 'unit', 'sector', 'number', 'isOnHoseline', 'isUnInjured', 'isLost', 'isTrapped', 'isOutOfAir', 'isRegulatorIssue', 'isLowAir', 'isPackIssue', 'nameFFighter', 'psi', 'channel', 'rank', 'startDate'];
//var REPORT_ACTION_DEF = ['incident', 'sector', 'text'];
var IAP_DEF = ['fireControl', 'firefighterSafety', 'incident', 'isActionEffect', 'isArrangement', 'isBuilding', 'isFire', 'isLifeHazard', 'isOccupancy', 'isResources', 'isSpecial', 'isSprinkler', 'isVent', 'propertyPeople', 'evacuationLocation', 'showEvacutionLocation', 'rescue'];
var OSR_DEF = ['incident', 'isAddress', 'isOccupancy', 'isConstruction', 'isAssumeCommand', 'isLocation', 'isStrategy', 'isAttackLine', 'isWaterSupply', 'isIRIC', 'isBasement', 'isMobile', 'isDefensive', 'accountability', 'accountabilityLocation', 'unit', 'dispatchAddress', 'sizeOfBuilding', 'numberOfFloors', 'typeOfBuilding', 'subFloors', 'constructionType', 'roofType', 'conditions'];
var OBJECTIVES_DEF = ['incident', 'upgradeToFullRescue', 'assingSafety', 'establishSupplyLine', 'secureUtilities', 'ventiliation', 'createOnDeck', 'pressurizeExposures', 'monitorChannel16', 'salvage', 'establishRehab', 'customerService'];
var DISPATCHED_UNITS_DEF = ['incident', 'unitTypes'];
var USER_DEF = ['username', 'email', 'name', 'department'];
//var ROLE_DEF = ['name', 'users', 'roles'];

angular.module('ParseAdapter', ['DataServices'])

  .run(function (DataStore, ParseAdapter) {
    DataStore.registered_adapters.push(ParseAdapter);
  })

  .factory('ParseAdapter', function (LoadIncident_Parse, LoadAllIncidents_Parse, LoadIncidentTypes_Parse, CreateNewIncident_Parse, isLoggedIn_Parse,
                                     LoadActionTypes_Parse, LoadSectorTypes_Parse, CreateNewSectorType_Parse, LoadUnitTypes_Parse,
                                     SaveIncident_Parse, SaveSector_Parse, CreateNewSector_Parse, SaveReportAction_Parse,
                                     CreateNewMayday_Parse, SaveMayday_Parse, DeleteMayday_Parse,
                                     CreateNewUnit_Parse, DeleteUnit_Parse, StartIncidentUpdateTimer_Parse,
                                     SaveUnit_Parse, SetCallbacks_Parse) {
    return {
      adapter_id_str: 'parse',
      init: function () {
        if (ENABLE_SERVER_COMM && typeof Parse != 'undefined') {
          //var app_key =   localStorage.getItem('department_app_key');
          //var js_key =    localStorage.getItem('department_js_key');
          var app_key = "Rx2vAi13xDnzOpbSCPZr3nAQycuQ7eA7k9JLhkxR";
          var js_key = "1Qc5tKwXrMNm9tOlBsRw4VapXgNUHe9DIyNU9XMp";
          if (app_key && js_key) {
            Parse.initialize(app_key, js_key);
            StartIncidentUpdateTimer_Parse();
            return true;
          } else {
            console.log("app_key and js_key not defined.  Logging out.");
            try {
              Parse.User.logOut();
            } catch (err) {
              console.log("Error try to run Parse.User.logOut()  err:", err);
            }
            return false;
          }
        }
      },
      LoadIncidentTypes: LoadIncidentTypes_Parse,
      LoadAllIncidents: LoadAllIncidents_Parse,
      LoadIncident: LoadIncident_Parse,
      CreateNewIncident: CreateNewIncident_Parse,
      isLoggedIn: isLoggedIn_Parse,
      LoadActionTypes: LoadActionTypes_Parse,
      LoadSectorTypes: LoadSectorTypes_Parse,
      CreateNewSectorType: CreateNewSectorType_Parse,
      LoadUnitTypes: LoadUnitTypes_Parse,
      SaveIncident: SaveIncident_Parse,
      SaveSector: SaveSector_Parse,
      CreateNewSector: CreateNewSector_Parse,
      SaveReportAction: SaveReportAction_Parse,
      CreateNewMayday: CreateNewMayday_Parse,
      SaveMayday: SaveMayday_Parse,
      DeleteMayday: DeleteMayday_Parse,
      CreateNewUnit: CreateNewUnit_Parse,
      DeleteUnit: DeleteUnit_Parse,
      SaveUnit: SaveUnit_Parse,
      SetCallbacks: SetCallbacks_Parse
    };
  })

  .factory('DataStore_Parse', function () { return {} })

  .factory('DefaultParseErrorLogger', function () {
    return {
      error: function (obj, error) {
        console.log('Failed to create new object, with error code: ' + error.message);
      }
    }
  })


  .factory('ParseQuery', function ($q, $rootScope){
    return function(query, options){
      var defer = $q.defer();

      //default function call to find
      var functionToCall = 'find';
      if(options != undefined && options.functionToCall != undefined)
        functionToCall = options.functionToCall;

      //wrap defer resolve/reject in $apply so angular updates watch listeners
      var defaultParams = [{
        success: function(data){
          $rootScope.$apply(function(){
            defer.resolve(data);
          });
        },
        error: function(data, error){
          console.log('error:', error);
          $rootScope.$apply(function(){
            defer.reject(error);
          });
        }
      }];

      //check for additional parameters to add
      if(options && options.params)
        defaultParams = options.params.concat(defaultParams);


      query[functionToCall].apply(query, defaultParams);

      return defer.promise;
    }
  })

  .factory('ParseObject', function(ParseQuery){

    return function (parseData, fields){

      //verify parameters
      if(parseData == undefined) throw new Error('Missing parseData');
      if(fields == undefined) throw new Error('Missing fields.');

      //internal parse object reference
      var	parseObject = parseData;
      var model;

      //instantiate new parse object from string
      if(typeof parseData == 'string')
      {
        var ParseModel = Parse.Object.extend(parseData);
        parseObject = new ParseModel();
      }

      //expose underlying parse obejct through data property
      Object.defineProperty(this, 'data', { get : function(){ return parseObject; } });

      //add dynamic properties from fields array
      var self = this;
      for(var i=0; i<fields.length; i++)
      {
        //add closure
        (function() {
          var propName = fields[i];
          Object.defineProperty(self, propName, {
            get : function(){
              return parseObject.get(propName);
            },
            set : function(value){
              parseObject.set(propName, value);
            }
          });
        })();
      }

      //instance methods
      this.save = function(){
        return ParseQuery(parseObject, {functionToCall:'save', params:[null]})
      }
      this.delete = function(){
        return ParseQuery(parseObject, {functionToCall:'destroy'});
      }
      this.fetch = function(){
        return ParseQuery(parseObject, {functionToCall:'fetch'});
      }
    };

  })


  .factory('ConvertParseObject', function () {
    return function (parseObject, fields) {
      //add dynamic properties from fields array
      for (var i = 0; i < fields.length; i++) {
        //add closure
        (function () {
          var propName = fields[i];
          Object.defineProperty(parseObject, propName, {
            get: function () {
              return parseObject.get(propName);
            },
            set: function (value) {
              parseObject.set(propName, value);
            }
          });
        })();
      }
    }
  })

  .factory('isLoggedIn_Parse', function () {
    return function () {
      return Parse.User.current();
    }
  })

  .factory('FetchTypeForIncident_Parse', function (ConvertParseObject, DefaultParseErrorLogger) {
    return function (incident) {
      return incident.incidentType.fetch().then(function (type) {
          ConvertParseObject(type, INCIDENT_TYPE_DEF);
          incident.incidentType = type;
          return incident;
        },
        DefaultParseErrorLogger);
    }
  })
  .factory('CreateNewIap_Parse', function (ConvertParseObject) {
    return function (incident) {
      var IapParseObj = Parse.Object.extend('Iap');
      var iapObject = new IapParseObj();
      ConvertParseObject(iapObject, IAP_DEF);
      iapObject.isActionEffect = false;
      iapObject.isArrangement = false;
      iapObject.isBuilding = false;
      iapObject.isFire = false;
      iapObject.isLifeHazard = false;
      iapObject.isOccupancy = false;
      iapObject.isResources = false;
      iapObject.isSpecial = false;
      iapObject.isSprinkler = false;
      iapObject.isVent = false;
      iapObject.fireControl = "";
      iapObject.firefighterSafety = "";
      iapObject.propertyPeople = "";
      iapObject.evacuationLocation = "";
      iapObject.rescue = "";
      iapObject.incident = incident;
      return iapObject;
    }
  })
  .factory('LoadIAPForIncident_Parse', function (ConvertParseObject, CreateNewIap_Parse, DefaultParseErrorLogger) {
    return function (incident) {
      var queryIap = new Parse.Query(Parse.Object.extend('Iap'));
      queryIap.equalTo("incident", incident);
      return queryIap.first().then(
        function (iapObject) {
          if (iapObject) {
            ConvertParseObject(iapObject, IAP_DEF);
            incident.iap = iapObject;
          } else {
            incident.iap = CreateNewIap_Parse(incident);
          }
          return incident;
        },
        DefaultParseErrorLogger
      );
    }
  })

  .factory('FetchAcctTypeForSector_Parse', function (ConvertParseObject, DefaultParseErrorLogger) {
    return function (sector) {
      if (sector.acctUnit) {
        return sector.acctUnit.fetch().then(
          function (acctUnit) {
            ConvertParseObject(acctUnit, UNIT_TYPE_DEF);
            sector.acctUnit = acctUnit;
            return sector;
          },
          DefaultParseErrorLogger
        );
      }
    }
  })

  .factory('FetchTypeForSector_Parse', function (ConvertParseObject, DefaultParseErrorLogger) {
    return function (sector) {
      return sector.sectorType.fetch().then(
        function (type) {
          ConvertParseObject(type, SECTOR_TYPE_DEF);
          sector.sectorType = type;
          return sector;
        },
        DefaultParseErrorLogger
      );
    }
  })

  .factory('FetchTypeForUnit_Parse', function (ConvertParseObject, DefaultParseErrorLogger) {
    return function (unit) {
      return unit.type.fetch().then(
        function (type) {
          ConvertParseObject(type, UNIT_TYPE_DEF);
          unit.type = type;
          return unit;
        },
        DefaultParseErrorLogger
      );
    }
  })

  .factory('FetchActionsForUnit_Parse', function (ConvertParseObject, DefaultParseErrorLogger) {
    return function (unit) {
      var relation = unit.relation("actions");
      return relation.query().find().then(
        function (actions) {
          if (!unit.actionsArr) {
            unit.actionsArr = [];
          }
          for (var i = 0; i < actions.length; i++) {
            var action = actions[i];
            ConvertParseObject(action, ACTION_TYPE_DEF);
            unit.actionsArr.push(action);
          }
          return unit;
        },
        DefaultParseErrorLogger
      );
    }
  })
  .factory('LoadUnitsForSector_Parse',
  function ($q, DataStore_Parse, ConvertParseObject, FetchTypeForUnit_Parse, FetchActionsForUnit_Parse, DefaultParseErrorLogger) {
    return function (sector) {
      sector.units = [];
      var queryUnits = new Parse.Query(Parse.Object.extend('Unit'));
      queryUnits.equalTo("sector", sector);
      return queryUnits.find().then(function (units) {
          var promises = [];
          for (var i = 0; i < units.length; i++) {
            var unit = units[i];
            ConvertParseObject(unit, UNIT_DEF);
            unit.allowClone = true;
            sector.units.push(unit);
            //DataStore_Parse.UpdateUnitTimer(unit);
            promises.push(FetchTypeForUnit_Parse(unit));
            promises.push(FetchActionsForUnit_Parse(unit));
          }
          return $q.all(promises);
        },
        DefaultParseErrorLogger);
    }
  })
  .factory('LoadSectorsForIncident_Parse',
  function ($q, ConvertParseObject, FetchAcctTypeForSector_Parse, FetchTypeForSector_Parse, LoadUnitsForSector_Parse, DefaultParseErrorLogger) {
    return function (incident) {
      var querySectors = new Parse.Query(Parse.Object.extend('Sector'));
      querySectors.equalTo("incident", incident);
      querySectors.include('sectorType');
      return querySectors.find().then(function (sectors) {
          incident.sectors = [];
          var promises = [];
          for (var i = 0; i < sectors.length; i++) {
            var sector = sectors[i];
            ConvertParseObject(sector, SECTOR_DEF);
            incident.sectors.push(sector);
            promises.push(FetchTypeForSector_Parse(sector));
            promises.push(LoadUnitsForSector_Parse(sector));
            promises.push(FetchAcctTypeForSector_Parse(sector));
          }
          return $q.all(promises);
        },
        DefaultParseErrorLogger);
    }
  })
  .factory('CreateNewObjectives_Parse', function (ConvertParseObject) {
    return function (incident) {
      var ObjectivesParseObj = Parse.Object.extend('Objectives');
      var objectivesObject = new ObjectivesParseObj();
      ConvertParseObject(objectivesObject, OBJECTIVES_DEF);
      objectivesObject.upgradeToFullRescue = false;
      objectivesObject.assingSafety = false;
      objectivesObject.establishSupplyLine = false;
      objectivesObject.secureUtilities = false;
      objectivesObject.ventiliation = false;
      objectivesObject.createOnDeck = false;
      objectivesObject.pressurizeExposures = false;
      objectivesObject.monitorChannel16 = false;
      objectivesObject.salvage = false;
      objectivesObject.establishRehab = false;
      objectivesObject.customerService = false;
      objectivesObject.incident = incident;
      return objectivesObject;
    }
  })
  .factory('FetchObjectivesForIncident_Parse', function (ConvertParseObject, DataStore_Parse, CreateNewObjectives_Parse, DefaultParseErrorLogger) {
    return function (incident) {
      var queryObjectives = new Parse.Query(Parse.Object.extend('Objectives'));
      queryObjectives.equalTo("incident", incident);
      return queryObjectives.first().then(
        function (objectivesObject) {
          if (objectivesObject) {
            ConvertParseObject(objectivesObject, OBJECTIVES_DEF);
            incident.objectives = objectivesObject;
          } else {
            incident.objectives = CreateNewObjectives_Parse(incident);
          }
          DataStore_Parse.UpdateObjectivesPercent(incident);
          return incident;
        },
        DefaultParseErrorLogger
      );
    }
  })
  .factory('CreateNewOSR_Parse', function (ConvertParseObject) {
    return function (incident) {
      var OSRParseObj = Parse.Object.extend('OSR');
      var osrObject = new OSRParseObj();
      ConvertParseObject(osrObject, OSR_DEF);
      osrObject.isAddress = false;
      osrObject.isOccupancy = false;
      osrObject.isConstruction = false;
      osrObject.isAssumeCommand = false;
      osrObject.isLocation = false;
      osrObject.isStrategy = false;
      osrObject.isAttackLine = false;
      osrObject.isWaterSupply = false;
      osrObject.isIRIC = false;
      osrObject.isBasement = false;
      osrObject.isMobile = false;
      osrObject.isDefensive = false;

      osrObject.accountability = '';
      osrObject.accountabilityLocation = '';
      osrObject.unit = '';
      osrObject.dispatchAddress = '';
      osrObject.sizeOfBuilding = '';
      osrObject.numberOfFloors = '';
      osrObject.typeOfBuilding = '';
      osrObject.subFloors = '';
      osrObject.constructionType = '';
      osrObject.roofType = '';
      osrObject.conditions = '';

      osrObject.incident = incident;

      return osrObject;
    }
  })
  .factory('FetchOSRForIncident_Parse', function (ConvertParseObject, DataStore_Parse, CreateNewOSR_Parse, DefaultParseErrorLogger) {
    return function (incident) {
      var queryOSR = new Parse.Query(Parse.Object.extend('OSR'));
      queryOSR.equalTo("incident", incident);
      return queryOSR.first().then(
        function (osrObject) {
          if (osrObject) {
            ConvertParseObject(osrObject, OSR_DEF);
            incident.osr = osrObject;
          } else {
            incident.osr = CreateNewOSR_Parse(incident);
          }
          DataStore_Parse.UpdateOsrPercent(incident);
          return incident;
        },
        DefaultParseErrorLogger
      );
    }
  })
  .factory('LoadDispatchedUnitsForIncident_Parse', function ($q, ConvertParseObject, DefaultParseErrorLogger) {
    return function (incident) {
      var queryDispatchedUnits = new Parse.Query(Parse.Object.extend('DispatchedUnits'));
      queryDispatchedUnits.equalTo("incident", incident);
      return queryDispatchedUnits.first().then(function (dispatchedUnitsObj) {
          if (!dispatchedUnitsObj) {
            var DispatchedUnitsObj = Parse.Object.extend('DispatchedUnits');
            dispatchedUnitsObj = new DispatchedUnitsObj();
            ConvertParseObject(dispatchedUnitsObj, DISPATCHED_UNITS_DEF);
            dispatchedUnitsObj.incident = incident;
            dispatchedUnitsObj.unitTypes = [];
            incident.dispatchedUnits = dispatchedUnitsObj;
            return dispatchedUnitsObj.save(null, {
              error: function (error) {
                console.log('(2) Failed to save dispatechedUnitsObj with error code: ' + error.message);
              }
            });
          } else {
            ConvertParseObject(dispatchedUnitsObj, DISPATCHED_UNITS_DEF);
            incident.dispatchedUnits = dispatchedUnitsObj;
            for (var i = 0; i < dispatchedUnitsObj.unitTypes.length; i++) {
              var unitType = dispatchedUnitsObj.unitTypes[i];
              ConvertParseObject(unitType, UNIT_TYPE_DEF);
            }
            return incident;
          }
        },
        DefaultParseErrorLogger);
    }
  })
  .factory('CreateNewUpgrade_Parse', function (ConvertParseObject) {
    return function (incident) {
      var UpgradeParseObj = Parse.Object.extend('Upgrade');
      var upgradeObject = new UpgradeParseObj();
      ConvertParseObject(upgradeObject, UPGRADE_DEF);
      upgradeObject.incident = incident;
      upgradeObject.isWorkingFire = false;
      upgradeObject.is1stAlarm = false;
      upgradeObject.is2ndAlarm = false;
      upgradeObject.is3rdAlarm = false;
      upgradeObject.is4thAlarm = false;
      upgradeObject.isBalanceTo = false;
      upgradeObject.isEnRoute = false;
      return upgradeObject;
    }
  })
  .factory('LoadUpgradeForIncident_Parse', function (ConvertParseObject, CreateNewUpgrade_Parse, DefaultParseErrorLogger) {
    return function (incident) {
      var queryUpgrade = new Parse.Query(Parse.Object.extend('Upgrade'));
      queryUpgrade.equalTo("incident", incident);
      return queryUpgrade.first().then(
        function (upgradeObject) {
          if (upgradeObject) {
            ConvertParseObject(upgradeObject, UPGRADE_DEF);
            incident.upgrade = upgradeObject;
          } else {
            incident.upgrade = CreateNewUpgrade_Parse(incident);
          }
          return incident;
        },
        DefaultParseErrorLogger
      );
    }
  })
  .factory('LoadIncident_Parse', function ($q, ConvertParseObject,
                                           FetchTypeForIncident_Parse, LoadIAPForIncident_Parse, LoadSectorsForIncident_Parse,
                                           LoadAllMaydaysForIncident_Parse, FetchObjectivesForIncident_Parse, FetchOSRForIncident_Parse,
                                           LoadUpgradeForIncident_Parse, LoadDispatchedUnitsForIncident_Parse,
                                           FindAllMaydayUnitsForIncident, DefaultParseErrorLogger, DataStore_Parse) {
    return function (incidentObjectId) {
      var queryIncident = new Parse.Query(Parse.Object.extend('Incident'));
      queryIncident.equalTo("objectId", incidentObjectId);
      queryIncident.include('incidentType');
      return queryIncident.first().then(function (incident) {
          if (incident) {
            ConvertParseObject(incident, INCIDENT_DEF);

            var promises = [];
            promises.push(FetchTypeForIncident_Parse(incident));
            promises.push(LoadSectorsForIncident_Parse(incident));
            promises.push(LoadAllMaydaysForIncident_Parse(incident));
            promises.push(LoadIAPForIncident_Parse(incident));
            promises.push(FetchObjectivesForIncident_Parse(incident));
            promises.push(FetchOSRForIncident_Parse(incident));
            promises.push(LoadUpgradeForIncident_Parse(incident));
            promises.push(LoadDispatchedUnitsForIncident_Parse(incident));
          }
          return $q.all(promises).then(function () {
              if(incident) {
                FindAllMaydayUnitsForIncident(incident);
              }

              DataStore_Parse.incidentObjectId = incidentObjectId;
              return incident;
            },
            DefaultParseErrorLogger);
        },
        DefaultParseErrorLogger);
    }
  })
  .factory('CreateNewIncident_Parse', function (ConvertParseObject, DataStore_Parse) {
    return function () {
      var IncidentParseObj = Parse.Object.extend('Incident');
      var incidentObject = new IncidentParseObj();
      ConvertParseObject(incidentObject, INCIDENT_DEF);
      //DataStore_Parse.incident = incidentObject;
      return incidentObject;
    }
  })


  .factory('LoadAllIncidents_Parse',
  function ($q, ConvertParseObject, Incidents, FetchTypeForIncident_Parse, DefaultParseErrorLogger) {
    return function () {
      var queryIncidents = new Parse.Query(Parse.Object.extend('Incident'));
      return queryIncidents.find().then(function (incidents_qry) {
          var incidents = [];
          var promises = [];
          for (var i = 0; i < incidents_qry.length; i++) {
            var incident = incidents_qry[i];
            ConvertParseObject(incident, INCIDENT_DEF);
            FetchTypeForIncident_Parse(incident);
            incidents.push(incident);
          }
          return $q.all(promises).then(function () {
              return incidents;
            },
            DefaultParseErrorLogger);
        },
        DefaultParseErrorLogger);
    }
  })


  .factory('LoadIncidentTypes_Parse',
  function (ConvertParseObject, IncidentTypes, DefaultParseErrorLogger) {
    return function () {
      var queryIncidentTypes = new Parse.Query(Parse.Object.extend('IncidentType'));
      return queryIncidentTypes.find().then(function (incidentTypes) {
          IncidentTypes.removeAll();
          for (var i = 0; i < incidentTypes.length; i++) {
            var incidentType = incidentTypes[i];
            ConvertParseObject(incidentType, INCIDENT_TYPE_DEF);
            //var nameRefor = incidentType.nameShort.toUpperCase();
            IncidentTypes.push(incidentType);
          }
          return IncidentTypes;
        },
        DefaultParseErrorLogger);
    }
  })


  .factory('LoadActionTypes_Parse', function (ParseQuery, ConvertParseObject) {
    return function (actionTypes) {
      var queryActionTypes = new Parse.Query(Parse.Object.extend('ActionType'));
      queryActionTypes.limit(1000);
      return queryActionTypes.find({
        success: function (actionTypes_) {
          for (var i = 0; i < actionTypes_.length; i++) {
            var actionType = actionTypes_[i];
            ConvertParseObject(actionType, ACTION_TYPE_DEF);
            actionTypes.push(actionType);
            var nameRefor = actionType.name.toUpperCase();
            actionTypes[nameRefor] = actionType;
          }//for
          return actionTypes;
        },
        error: function (error) {
          console.log('Failed to LoadActionTypes, with error code: ' + error.message);
        }
      });
    }
  })

  .factory('LoadSectorTypes_Parse', function (SectorTypes, ParseQuery, ConvertParseObject) {
    return function () {
      var querySectorTypes = new Parse.Query(Parse.Object.extend('SectorType'));
      return querySectorTypes.find({
        success: function (sectorTypes) {
          for (var i = 0; i < sectorTypes.length; i++) {
            var sectorType = sectorTypes[i];
            ConvertParseObject(sectorType, SECTOR_TYPE_DEF);
          }//for
          return sectorType;
        },
        error: function (error) {
          console.log('Failed to LoadSectorTypes, with error code: ' + error.message);
        }
      });
    }
  })
  .factory('CreateNewSectorType_Parse', function (ConvertParseObject) {
    return function () {
      var SectorTypeParseObj = Parse.Object.extend('SectorType');
      var sectorTypeObject = new SectorTypeParseObj();
      ConvertParseObject(sectorTypeObject, SECTOR_TYPE_DEF);
      sectorTypeObject.name = "";
      sectorTypeObject.manyBenchmarkBars = 0;
      sectorTypeObject.hasAcctBtn = false;
      sectorTypeObject.hasActions = false;
      sectorTypeObject.hasClock = false;
      sectorTypeObject.hasPsiBtn = false;
      sectorTypeObject.isVisible = false;
      sectorTypeObject.hasClassicBnch = false;
      sectorTypeObject.hasVentBnch = false;
      sectorTypeObject.hasIricBnch = false;
      sectorTypeObject.hasSafetyBnch = false;
      sectorTypeObject.hasTreatmentBnch = false;
      sectorTypeObject.hasLzBnch = false;
      sectorTypeObject.hasTriageBnch = false;
      return sectorTypeObject;
    }
  })

  .factory('LoadUnitTypes_Parse', function (ParseQuery, ConvertParseObject) {
    return function () {
      var queryUniTypes = new Parse.Query(Parse.Object.extend('UnitType'));
      queryUniTypes.limit(1000);
      return queryUniTypes.find({
        success: function (unitTypes_) {
          var unitTypes = [];
          for (var i = 0; i < unitTypes_.length; i++) {
            var unitType = unitTypes_[i];
            ConvertParseObject(unitType, UNIT_TYPE_DEF);
            unitTypes.push(unitType);
            var nameRefor = unitType.name.toUpperCase();
            unitTypes[nameRefor] = unitType;
          }//for
          return unitTypes;
        },
        error: function (error) {
          console.log('Failed to LoadUnitTypes, with error code: ' + error.message);
        }
      });
    }
  })

  .factory('SaveIncident_Parse', function (DefaultErrorLogger, DataStore_Parse) {
    return function (incident) {
      DataStore_Parse.saveInProgress = true;
      return incident.save(null, DefaultErrorLogger).then(
          function(obj){
            DataStore_Parse.saveInProgress = false;
            return obj;
          }
      );
    }
  })

  .factory('SaveSector_Parse', function (DefaultErrorLogger) {
    return function (sector, DataStore_Parse) {
      DataStore_Parse.saveInProgress = true;
      return sector.save(null, DefaultErrorLogger).then(
          function(obj){
            DataStore_Parse.saveInProgress = false;
            return obj;
          }
      );
    }
  })
  .factory('CreateNewSector_Parse', function (ConvertParseObject) {
    return function (incident) {
      var SectorParseObj = Parse.Object.extend('Sector');
      var sectorObject = new SectorParseObj();
      ConvertParseObject(sectorObject, SECTOR_DEF);
      sectorObject.direction = "";
      sectorObject.number = "";
      sectorObject.row = 0;
      sectorObject.col = 0;
      sectorObject.incident = incident;
      sectorObject.bnchClsUnablePrim = false;
      sectorObject.bnchClsUnableSec = false;
      sectorObject.bnchCls1 = false;
      sectorObject.bnchCls2 = false;
      sectorObject.bnchCls3 = false;
      sectorObject.bnchCls4 = false;
      sectorObject.bnchVnt1 = false;
      sectorObject.bnchVnt2 = false;
      sectorObject.bnchVnt3 = false;
      sectorObject.bnchIrc1 = false;
      sectorObject.bnchIrc2 = false;
      sectorObject.bnchIrc3 = false;
      sectorObject.bnchIrc4 = false;
      sectorObject.bnchSaf1 = false;
      sectorObject.bnchSaf2 = false;
      sectorObject.bnchTrt1 = false;
      sectorObject.bnchTrt2 = false;
      sectorObject.bnchTrt3 = false;
      sectorObject.bnchLzo1 = false;
      sectorObject.bnchLzo2 = false;
      sectorObject.bnchLzo3 = false;
      sectorObject.bnchTri1 = 0;
      sectorObject.bnchTri2 = 0;
      sectorObject.bnchTri3 = 0;
      sectorObject.initialized = false;
      return sectorObject;
    }
  })

  .factory('SaveReportAction_Parse', function (DefaultErrorLogger) {
    return function (incident, sector, text) {
      var ReportAction = Parse.Object.extend("ReportAction");
      var reportAction = new ReportAction();
      reportAction.set("incident", incident);
      reportAction.set("sector", sector);
      reportAction.set("text", text);
      reportAction.save(null, DefaultErrorLogger);
    }
  })

  .factory('LoadAllMaydaysForIncident_Parse',
  function (ConvertParseObject, DefaultParseErrorLogger) {
    return function (incident) {
      var queryMaydays = new Parse.Query(Parse.Object.extend('Mayday'));
      queryMaydays.equalTo("incident", incident);
      queryMaydays.include('unitType');
      queryMaydays.include('sectorType');
      return queryMaydays.find().then(function (maydays) {
          incident.maydays = [];
          for (var i = 0; i < maydays.length; i++) {
            var mayday = maydays[i];
            ConvertParseObject(mayday, MAYDAY_DEF);
            incident.maydays.push(mayday);
          }
          return incident.maydays;
        },
        DefaultParseErrorLogger);
    }
  })
  .factory('FindAllMaydayUnitsForIncident', function () {
    return function (incident) {
      if(incident.maydays) {
        incident.maydays.forEach(function (mayday) {
          // Find instantiation of this mayday's sector and unit in the sector list
          var foundSector = false;
          incident.sectors.forEach(function (sector) {
            if (sector.id == mayday.sector.id) {
              mayday.sector = sector;
              foundSector = true;
              sector.units.forEach(function (unit) {
                if (unit.id == mayday.unit.id) {
                  mayday.unit = unit;
                  unit.hasMayday = true;
                  foundSector = true;
                }
              });
            }
          });
          if (!foundSector) {
            console.log("Did not find sector!");
          }
        });
      }
    }
  })
  .factory('SaveMayday_Parse', function (DefaultErrorLogger) {
    return function (mayday) {
      return mayday.save(null, DefaultErrorLogger);
    }
  })
  .factory('CreateNewMayday_Parse', function (ConvertParseObject) {
    return function (incident) {
      var MaydayParseObj = Parse.Object.extend('Mayday');
      var newMayday = new MaydayParseObj();
      ConvertParseObject(newMayday, MAYDAY_DEF);
      newMayday.incident = incident;
      return newMayday;
    }
  })
  .factory('DeleteMayday_Parse', function (DefaultErrorLogger) {
    return function (mayday) {
      mayday.unit.hasMayday = false;
      return mayday.destroy(null, DefaultErrorLogger);
    }
  })

  .factory('CreateNewUnit_Parse', function (ConvertParseObject, DefaultErrorLogger) {
    return function (sector, unitType) {
      var UnitParseObj = Parse.Object.extend('Unit');
      var newUnit = new UnitParseObj();
      ConvertParseObject(newUnit, UNIT_DEF);
      newUnit.hasPar = false;
      newUnit.manyPeople = 0;
      newUnit.par = 0;
      newUnit.psi = 4000;
      newUnit.type = unitType;
      newUnit.sector = sector;
      newUnit.timer_start = new Date();
      newUnit.timer_running = true;
      newUnit.save(null, DefaultErrorLogger);
      return newUnit;
    }
  })
  .factory('DeleteUnit_Parse', function (DefaultErrorLogger) {
    return function (unit) {
      return unit.destroy(null, DefaultErrorLogger);
    }
  })
  .factory('SaveUnit_Parse', function (DefaultErrorLogger, DataStore_Parse) {
    return function (unit) {
      DataStore_Parse.saveInProgress = true;
      return unit.save(null, DefaultErrorLogger).then(
          function(obj){
            DataStore_Parse.saveInProgress = false;
            return obj;
          }
      );
    }
  })

  .factory('StartIncidentUpdateTimer_Parse', function ($interval, DataStore_Parse, DefaultParseErrorLogger, LoadIncident_Parse) {
    return function () {
      function updateIncidentData() {
        if(!DataStore_Parse.saveInProgress) {
          if(DataStore_Parse.incidentObjectId){
            LoadIncident_Parse(DataStore_Parse.incidentObjectId).then(
                function(new_incident) {
                  DataStore_Parse.DeepCopyIncident(new_incident);
                },
                DefaultParseErrorLogger
            );
          }
        }
      }

      $interval(updateIncidentData, 3000);
    }
  })

  .factory('SetCallbacks_Parse', function (DataStore_Parse) {
    return function (
        UpdateObjectivesPercent, UpdateOsrPercent, UpdateUnitTimer, DeepCopyIncident
    ) {
      DataStore_Parse.UpdateObjectivesPercent = UpdateObjectivesPercent;
      DataStore_Parse.UpdateOsrPercent = UpdateOsrPercent;
      DataStore_Parse.UpdateUnitTimer = UpdateUnitTimer;
      DataStore_Parse.DeepCopyIncident = DeepCopyIncident;

    }
  })

;