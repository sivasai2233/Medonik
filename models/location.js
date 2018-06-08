var mongoose = require('mongoose');

var locationSchema = mongoose.Schema({
	location		: 	{ type: String },
	status			:   { type: Number },
	createdAt 		: 	{ type: Date, default: Date.now },
	updatedAt 		: 	{ type: Date, default: Date.now },
});

module.exports = mongoose.model('Location', locationSchema);