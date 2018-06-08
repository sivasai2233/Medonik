var mongoose = require('mongoose');

var medicationSchema = mongoose.Schema({
    prescribeDate   :   { type: Date },
    medicineType    :   { type: String },
    medicineName    :   { type: String },
    dosage          :   { type: String },
    patientNotes    :   { type: String },
    doctorId        :   { type: String },
	patientId		: 	{ type: String },
	createdAt 		: 	{ type: Date, default: Date.now },
	updatedAt 		: 	{ type: Date, default: Date.now }
});

module.exports = mongoose.model('Medication', medicationSchema);
