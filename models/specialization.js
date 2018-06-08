var mongoose = require('mongoose');

var specializationSchema = mongoose.Schema({
	specialization	: 	{ type: String },
	createdAt 		: 	{ type: Date, default: Date.now },
	updatedAt 		: 	{ type: Date, default: Date.now }
});

module.exports = mongoose.model('Specialization', specializationSchema);
