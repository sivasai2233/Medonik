var User = require('.././models/user');
var Customer = require('.././models/customer');
var Patient = require('.././models/patient');
var Doctor = require('.././models/doctor');
var Location = require('.././models/location');
var Doctor = require('.././models/doctor');

module.exports = {
  getAdminById: function(email) {
    User.findOne({ email: email }, function(err, user) {
      if (err) {
        return err;
      } else {
        return user;
      }
    });
  }
};
