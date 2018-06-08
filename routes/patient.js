var async = require('async');
var Patient = require('../models/patient');
var User = require('../models/user');
var Location = require('../models/location');
var crypto = require('../config/crypto');

module.exports = function(router, upload) {
  router.get('/patients/all', function(req, res) {
    Patient.find({}, function(err, patients) {
      if (err) res.json({ success: false, error: err.stack });
      res.json({ success: true, data: patients });
    });
  });

  // GET patient by customerId
  router.get('/patient/:customerId', function(req, res) {
    Patient.find({ customerId: req.params.customerId }, function(err, patient) {
      if (err) res.json({ success: false, error: err.stack });
      res.json({ success: true, data: patient });
    });
  });

  router.get('/patient/get-patient-by-id/:patientId', function(req, res) {
    var patientInfoObject = {};
    async.waterfall(
      [
        function(callback) {
          Patient.findOne({ _id: req.params.patientId }, function(
            err,
            patient
          ) {
            if (err) {
              callback(err);
            } else if (patient == null) {
              callback(null, undefined);
            } else {
              patientInfoObject['basicInfo'] = patient;
              callback(null, patient);
            }
          });
        },
        function(patient, callback) {
          if (patient !== undefined) {
            Location.findOne({ _id: patient.locationId }, function(
              err,
              location
            ) {
              if (err) {
                callback(err);
              } else {
                patientInfoObject['locationInfo'] = location;
                callback(null, patientInfoObject);
              }
            });
          } else {
            callback(null, patientInfoObject);
          }
        }
      ],
      function(err, patientInfoObject) {
        if (err) {
          res.json({ success: false, error: err.stack });
        } else {
          res.json({ success: true, data: patientInfoObject });
        }
      }
    );
  });

  var newUpload = upload.single('avatar');
  router.post('/patient/create', function(req, res) {
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
            newUser.mobile = req.body.mobile;
            newUser.bloodGroup = req.body.bloodGroup;
            newUser.avatar = req.body.avatar;
            newUser.userRole = 3;
            newUser.status = 1;
            newUser.save(function(err, user) {
              if (err) {
                res.json({
                  success: false,
                  message: 'Error in creating user',
                  error: err.stack
                });
              } else {
                addPatient(req.body, function(response) {
                  if (response.success) {
                    res.json({
                      success: true,
                      message: 'New patient created.'
                    });
                  } else {
                    deleteUser(user._id, function(resp) {
                      if (response.success) {
                        res.json({
                          success: false,
                          message: 'Error in creating patient.',
                          error: err.stack
                        });
                      } else {
                        res.json({
                          success: false,
                          message: 'Error in creating patient.'
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

  router.post('/patient/update', function(req, res) {
    var patientInfoObj = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      avatar: req.body.avatar,
      //locationId: req.body.locationId,
      email: req.body.email,
      mobile: req.body.mobile,
      bloodGroup: req.body.bloodGroup,
      address: req.body.address
    };
    Patient.findByIdAndUpdate(req.body._id, { $set: patientInfoObj }, function(
      err
    ) {
      if (err) {
        res.json({ success: false, error: err.stack });
      } else {
        res.json({ success: true, message: 'Patient Updated.' });
      }
    });
  });

  function addPatient(patient, callback) {
    var newPatient = new Patient();
    newPatient.firstName = patient.firstName;
    newPatient.lastName = patient.lastName;
    newPatient.avatar = patient.avatar;
    newPatient.mobile = patient.mobile;
    newPatient.email = patient.email;
    newPatient.age = patient.age;
    newPatient.bloodGroup = patient.bloodGroup;
    //newPatient.locationId = patient.locationId;
    newPatient.customerId = patient.customerId;
    newPatient.address = patient.address;
    newPatient.status = 1;
    newPatient.isVerified = 0;
    newPatient.save(function(err) {
      if (err) callback({ success: false, error: err.stack });
      callback({ success: true, message: 'New Patient created.' });
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
