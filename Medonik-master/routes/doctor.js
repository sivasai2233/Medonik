var async = require('async');
var _ = require('underscore');
var Doctor = require('../models/doctor');
var User = require('../models/user');
var Specialization = require('../models/specialization');
var crypto = require('../config/crypto');

module.exports = function(router, upload) {
  router.get('/doctors/all', function(req, res) {
    var doctorsInfoObject = {};
    async.waterfall(
      [
        function(callback) {
          Doctor.find({}, function(err, doctors) {
            if (err) callback(err);
            else callback(null, doctors);
          });
        },
        function(doctors, callback) {
          Specialization.find({}, function(err, specializations) {
            if (err) callback(err);
            else
              callback(null, {
                doctors: doctors,
                specializations: specializations
              });
          });
        },
        function(dataObject, callback) {
          var doctorsArray = [];
          for (var i = 0; i < dataObject.doctors.length; i++) {
            var specializationName = _.filter(
              dataObject.specializations,
              function(spec) {
                return spec._id == dataObject.doctors[i].specializationId;
              }
            );
            doctorsInfoObject['basicInfo'] = dataObject.doctors[i];
            doctorsInfoObject['specializationInfo'] = specializationName[0];
            doctorsArray.push(doctorsInfoObject);
            doctorsInfoObject = {};
          }
          callback(null, doctorsArray);
        }
      ],
      function(err, doctorsInfo) {
        if (err) res.json({ success: false, error: err });
        else res.json({ success: true, data: doctorsInfo });
      }
    );
  });

  router.get('/doctor/:id', function(req, res) {
    var data = {};
    async.waterfall(
      [
        function(callback) {
          Doctor.findById(req.params.id, function(err, doctor) {
            if (err) callback(err);
            data['basicInfo'] = doctor;
            callback(null, data);
          });
        },
        function(data, callback) {
          Specialization.findById(data.basicInfo.specializationId, function(
            err,
            spec
          ) {
            if (err) callback(err);
            data['specialization'] = spec;
            callback(null, data);
          });
        }
      ],
      function(err, data) {
        if (err) {
          res.json({ success: true, error: err });
        } else {
          res.json({ success: true, doctorInfo: data });
        }
      }
    );
  });

  var newUpload = upload.single('avatar');
  router.post('/doctor/create', function(req, res) {
    newUpload(req, res, function(error) {
      if (error) {
        res.json({
          success: false,
          message: 'File too large, maximum size 1 MB'
        });
      } else {
        req.body.avatar = req.file.path;
        User.findOne({ email: req.body.email }, function(err, user) {
          if (err) {
            res.json({ success: false, error: err.stack });
          }
          if (user) {
            res.json({ success: false, message: 'Email already exist' });
          } else {
            var newUser = new User();
            newUser.email = req.body.email;
            newUser.password = crypto.encrypt(req.body.password);
            newUser.firstName = req.body.firstName;
            newUser.lastName = req.body.lastName;
            newUser.avatar = req.body.avatar;
            newUser.mobile = req.body.mobile;
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
                addDoctor(req.body, function(response) {
                  if (response.success) {
                    res.json({ success: true, message: 'New doctor created.' });
                  } else {
                    deleteUser(user._id, function(resp) {
                      if (response.success) {
                        res.json({
                          success: false,
                          message: 'Error in creating doctor.',
                          error: err.stack
                        });
                      } else {
                        res.json({
                          success: false,
                          message: 'Error in creating doctor.'
                        });
                      }
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

  router.post('/doctor/update', function(req, res) {
    delete req.body['avatar'];
    Doctor.findByIdAndUpdate(req.body._id, { $set: req.body }, function(err) {
      if (err) {
        res.json({ success: false, error: err.stack });
      } else {
        res.json({ success: true, message: 'Doctor Updated.' });
      }
    });
  });

  function addDoctor(doctor, callback) {
    var newDoctor = new Doctor();
    newDoctor.firstName = doctor.firstName;
    newDoctor.lastName = doctor.lastName;
    newDoctor.avatar = doctor.avatar;
    newDoctor.specializationId = doctor.specializationId;
    newDoctor.officeAddress = doctor.officeAddress;
    newDoctor.residentialAddress = doctor.residentialAddress;
    newDoctor.mobile = doctor.mobile;
    newDoctor.alternateMobile = doctor.alternateMobile;
    newDoctor.email = doctor.email;
    newDoctor.password = doctor.password;
    newDoctor.graduationYear = doctor.graduationYear;
    newDoctor.status = 1;
    newDoctor.save(function(err) {
      if (err) callback({ success: false, error: err.stack });
      callback({ success: true, message: 'New doctor created.' });
    });
  }

  function deleteUser(userId, callback) {
    User.remove({ _id: userId }, function(err, removedUser) {
      if (err)
        callback({
          success: false,
          message: 'Error in deleting user',
          error: err.stack
        });
      callback({ success: true });
    });
  }
};
