var mongoose 	= require('mongoose');

var userSchema = mongoose.Schema({
	firstName	: 	{ type: String },
	lastName	: 	{ type: String },
	avatar		: 	{ type: String },
	email		: 	{ type: String },
	mobile		: 	{ type: Number },
	password	: 	{ type: String },
	userRole	:   { type: Number },
	token		:   { type: String },
	status		:   { type: Number },
	createdAt 	: 	{ type: Date, default: Date.now },
	updatedAt 	: 	{ type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);