var _ = require('underscore');
var Appointment = require('../models/appointment');
var User = require('../models/user');
var Specialization = require('../models/specialization');
var crypto = require('../config/crypto');

module.exports = function(router) {
  router.post('/appointment/create', function(req, res) {
    User.findOne({ email: req.body.email }, function(err, user) {
      if (err) {
        res.json({ success: false, error: err.stack });
      }
      if (user) {
        res.json({ success: false, message: 'Email already exist' });
      } else {
        var newUser = new User();
        newUser.firstName = req.body.firstName;
        newUser.lastName = req.body.lastName;
        newUser.email = req.body.email;
        newUser.mobile = req.body.mobile;
        newUser.reason = req.body.reason;
        newUser.userRole = 4;
        newUser.status = 1;
        newUser.save(function(err, user) {
          if (err) {
            res.json({
              success: false,
              message: 'Error in creating user',
              error: err.stack
            });
          } else {
            addAppointment(req.body, function(response) {
              if (response.success) {
                res.json({
                  success: true,
                  message: 'New appointment created.'
                });
              } else {
                deleteUser(user._id, function(resp) {
                  if (response.success) {
                    res.json({
                      success: false,
                      message: 'Error in creating appointment.',
                      error: err.stack
                    });
                  } else {
                    res.json({
                      success: false,
                      message: 'Error in creating appointment.'
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  });

  function addAppointment(appointment, callback) {
    var newAppointment = new Appointment();
    newAppointment.firstName = appointment.firstName;
    newAppointment.lastName = appointment.lastName;
    newAppointment.mobile = appointment.mobile;
    newAppointment.email = appointment.email;
    newAppointment.reason = appointment.reason;
    newAppointment.specializationId = appointment.specializationId;
    newAppointment.status = 1;
    newAppointment.save(function(err) {
      if (err) callback({ success: false, error: err.stack });
      callback({ success: true, message: 'New appointment created.' });
    });
  }
};
