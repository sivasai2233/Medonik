var mongoose = require('mongoose');

var appointmentSchema = mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  mobile: { type: Number },
  specializationId: { type: String },
  appointmentId: { type: String },
  //date: { type: String },
  reason: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
