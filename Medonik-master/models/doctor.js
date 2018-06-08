var mongoose = require('mongoose');

var doctorSchema = mongoose.Schema({
	firstName			: 	{ type: String },
	lastName			: 	{ type: String },
	avatar				: 	{ type: String },
	specializationId	: 	{ type: String },
	officeAddress		: 	{ type: String },
	residentialAddress	: 	{ type: String },
	mobile				: 	{ type: String },
	alternateMobile		: 	{ type: String },
	email				: 	{ type: String },
	password			:   { type: String },
	graduationYear		: 	{ type: String },
	status				: 	{ type: Number },
	createdAt 			: 	{ type: Date, default: Date.now },
	updatedAt 			: 	{ type: Date, default: Date.now }
});

module.exports = mongoose.model('Doctor', doctorSchema);
