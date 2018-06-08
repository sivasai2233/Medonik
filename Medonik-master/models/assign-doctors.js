var mongoose = require('mongoose');

var assignDoctorSchema = mongoose.Schema({
	doctorId		: 	{ type: String },
	patientId		: 	{ type: String },
	createdAt 		: 	{ type: Date, default: Date.now },
	updatedAt 		: 	{ type: Date, default: Date.now }
});

module.exports = mongoose.model('AssignDoctor', assignDoctorSchema);
