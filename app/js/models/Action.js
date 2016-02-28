// Default values
var DEFAULT_category = '';
var DEFAULT_incidentType = [];
var DEFAULT_isWarning = false;
var DEFAULT_name = '';

function Action(category,     // string
                incidentType, // string[]
                isWarning,    // bool
                name) {       // string
  this.category = typeof category !== 'undefined' ? category : DEFAULT_category;
  this.incidentType = typeof incidentType !== 'undefined' ? incidentType : DEFAULT_incidentType;
  this.isWarning = typeof isWarning !== 'undefined' ? isWarning : DEFAULT_isWarning;
  this.name = typeof name !== 'undefined' ? name : DEFAULT_name;
}
