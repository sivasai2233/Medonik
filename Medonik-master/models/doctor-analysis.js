var mongoose = require('mongoose');

var docAnalysisSchema = mongoose.Schema({
    consultationDate    :   { type: Date },
    consultationReason  :   { type: String },
    consultationMode    :   { type: String },
    analysisDetail      :   { type: String },
    doctorId            :   { type: String },
	patientId		    : 	{ type: String },
	createdAt 		    : 	{ type: Date, default: Date.now },
	updatedAt 		    : 	{ type: Date, default: Date.now }
});

module.exports = mongoose.model('DoctorAnalysis', docAnalysisSchema);
