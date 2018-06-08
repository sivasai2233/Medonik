var mongoose = require('mongoose');

var healthCardSchema = mongoose.Schema({
    fosInteractionDate  :   { type: Date },
    interactionMode     :   { type: String },
    fosId		        : 	{ type: String },
    visitPurpose        :   { type: String },
    interactionOutcome  :   { type: String },
	patientId		    : 	{ type: String },
	createdAt 		    : 	{ type: Date, default: Date.now },
	updatedAt 		    : 	{ type: Date, default: Date.now }
});

module.exports = mongoose.model('HealthCard', healthCardSchema);
