var mongoose = require('mongoose');

var customerSchema = mongoose.Schema({
	firstName		: 	{ type: String },
	lastName		: 	{ type: String },
	avatar			: 	{ type: String },
	location		: 	{ type: String },
	mobile			: 	{ type: String },
	email			: 	{ type: String },
	serviceLocation	:   { type: String },
	token			:   { type: String },
	status			:   { type: Number },
	isVerified		: 	{ type: Number, default: 0},
	createdAt 		: 	{ type: Date, default: Date.now },
	updatedAt 		: 	{ type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', customerSchema);