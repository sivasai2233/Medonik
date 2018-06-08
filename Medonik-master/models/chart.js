var mongoose = require('mongoose');

var chartSchema = mongoose.Schema({
	chartName		: 	{ type: String },
	label			: 	{ type: String },
	minValue		: 	{ type: Number },
	maxValue		: 	{ type: Number },
    majorTicks      : 	{ type: Number },
    minorTicks      : 	{ type: Number },
	thresholdValue	: 	{ type: String },
	value			: 	{ type: Number },	
	createdAt 		: 	{ type: Date, default: Date.now },
	updatedAt 		: 	{ type: Date, default: Date.now }
});

module.exports = mongoose.model('Chart', chartSchema);
