var async = require('async');
var User = require('.././models/user');
var Customer = require('.././models/customer');
var Patient = require('.././models/patient');
var Doctor = require('.././models/doctor');
var Location = require('.././models/location');
var commonUtils = require('.././common/utils');

module.exports = function(router, upload) {
  // update image
  var newUpload = upload.single('avatar');
  router.post('/upload-image', function(req, res) {
    newUpload(req, res, function(error) {
      if (error) {
        res.json({
          success: false,
          error: 'File too large, maximum size 1 MB'
        });
      } else {
        var newObject = {};
        newObject['avatar'] = req.file.path;
        if (req.body.model == 'user') {
          User.findByIdAndUpdate(req.body.id, { $set: newObject }, function(
            err
          ) {
            if (err) {
              res.json({ success: false, error: err.stack });
            } else {
              res.json({ success: true, message: 'Image updated.' });
            }
          });
        } else if (req.body.model == 'customer') {
          Customer.findByIdAndUpdate(req.body.id, { $set: newObject }, function(
            err
          ) {
            if (err) {
              res.json({ success: false, error: err.stack });
            } else {
              res.json({ success: true, message: 'Image updated.' });
            }
          });
        } else if (req.body.model == 'patient') {
          Patient.findByIdAndUpdate(req.body.id, { $set: newObject }, function(
            err
          ) {
            if (err) {
              res.json({ success: false, error: err.stack });
            } else {
              res.json({ success: true, message: 'Image updated.' });
            }
          });
        } else if (req.body.model == 'doctor') {
          Doctor.findByIdAndUpdate(req.body.id, { $set: newObject }, function(
            err
          ) {
            if (err) {
              res.json({ success: false, error: err.stack });
            } else {
              res.json({ success: true, message: 'Image updated.' });
            }
          });
        } else if (req.body.model == 'fos') {
          FOS.findByIdAndUpdate(req.body.id, { $set: newObject }, function(
            err
          ) {
            if (err) {
              res.json({ success: false, error: err.stack });
            } else {
              res.json({ success: true, message: 'Image updated.' });
            }
          });
        }
      }
    });
  });

  // get user
  router.get('/get-user-info', commonUtils.isLoggedIn, function(req, res) {
    if (req.user.userRole == 2) {
      getCustomerInfo(req.user, function(response) {
        res.json(response);
      });
    } else if (req.user.userRole == 4) {
      getDocInfo(req.user, function(response) {
        res.json(response);
      });
    } else if (req.user.userRole == 5) {
      getFOSInfo(req.user, function(response) {
        res.json(response);
      });
    } else {
      res.json(req.user);
    }
  });

  // roles
  router.get('/permissionService', commonUtils.isLoggedIn, function(req, res) {
    switch (req.user.userRole) {
      case 0:
        res.json({ isSuperAdmin: true });
        break;
      case 1:
        res.json({ isAdmin: true });
        break;
      case 2:
        res.json({ isCustomer: true });
        break;
      case 3:
        res.json({ isPatient: true });
        break;
      case 4:
        res.json({ isDoctor: true });
        break;
      case 5:
        res.json({ isFOS: true });
        break;
    }
  });

  router.get('/dashboard-counts', function(req, res) {
    var dataObject = {};
    async.waterfall(
      [
        function(callback) {
          User.find({ userRole: 1 }, function(err, results) {
            if (err) {
              callback(err);
            } else {
              dataObject['users'] = results.length;
              callback(null, dataObject);
            }
          });
        },
        function(dataObject, callback) {
          Customer.find({}, function(err, results) {
            if (err) {
              callback(err);
            } else {
              dataObject['customers'] = results.length;
              callback(null, dataObject);
            }
          });
        },
        function(dataObject, callback) {
          Patient.count({}, function(err, results) {
            if (err) {
              callback(err);
            } else {
              dataObject['patients'] = results.length;
              callback(null, dataObject);
            }
          });
        },
        function(dataObject, callback) {
          Doctor.find({}, function(err, results) {
            if (err) {
              callback(err);
            } else {
              dataObject['doctors'] = results.length;
              callback(null, dataObject);
            }
          });
        },
        //  function(dataObject, callback) {
        //  FOS.find({}, function(err, results) {
        //  if (err) {
        //    callback(err);
        //  } else {
        //    dataObject['fos'] = results.length;
        //  callback(null, dataObject);
        //  }
        //  });
        //  },
        function(dataObject, callback) {
          Location.find({}, function(err, results) {
            if (err) {
              callback(err);
            } else {
              dataObject['locations'] = results.length;
              callback(null, dataObject);
            }
          });
        }
      ],
      function(err, dataObject) {
        if (err) {
          res.json({ success: false, error: err.stack });
        } else {
          res.json({ success: true, data: dataObject });
        }
      }
    );
  });
};

function getCustomerInfo(user, response) {
  var userInfo = {};
  Customer.findOne({ email: user.email }, function(err, customer) {
    if (err) {
      response({ success: false, error: err.stack });
    } else {
      userInfo['customerId'] = customer._id;
      userInfo['_id'] = user._id;
      userInfo['email'] = user.email;
      userInfo['userRole'] = user.userRole;
      userInfo['firstName'] = user.firstName;
      if (customer.avatar !== undefined) {
        userInfo['avatar'] = customer.avatar;
      }
      userInfo['mobile'] = customer.mobile;
      response(userInfo);
    }
  });
}

//function getFOSInfo(user, response) {
//var userInfo = {};
//  FOS.findOne({ email: user.email }, function(err, fos) {
//  if (err) {
//  response({ success: false, error: err.stack });
//} else {
//  userInfo['fosId'] = fos._id;
//  userInfo['_id'] = user._id;
//  userInfo['email'] = user.email;
//  userInfo['userRole'] = user.userRole;
//  userInfo['firstName'] = user.firstName;
//  if (fos.avatar !== undefined) {
//    userInfo['avatar'] = fos.avatar;
//  }
//  userInfo['mobile'] = fos.mobile;
//  response(userInfo);
//  }
//  });
//}

function getDocInfo(user, response) {
  var userInfo = {};
  Doctor.findOne({ email: user.email }, function(err, doctor) {
    if (err) response({ success: false, error: err.stack });
    userInfo['doctorId'] = doctor._id;
    userInfo['_id'] = user._id;
    userInfo['email'] = user.email;
    userInfo['userRole'] = user.userRole;
    userInfo['firstName'] = user.firstName;
    if (doctor.avatar !== undefined) {
      userInfo['avatar'] = doctor.avatar;
    }
    userInfo['mobile'] = doctor.mobile;
    response(userInfo);
  });
}

// function getAptInfo(user, response) {
//   var userInfo = {};
//   Appointment.findOne({ email: user.email }, function(err, appointment) {
//     if (err) response({ success: false, error: err.stack });
//     userInfo['appointmentId'] = appointment._id;
//     userInfo['_id'] = user._id;
//     userInfo['email'] = user.email;
//     userInfo['userRole'] = user.userRole;
//     userInfo['firstName'] = user.firstName;
//     if (appointment.avatar !== undefined) {
//       userInfo['avatar'] = appointment.avatar;
//     }
//     userInfo['mobile'] = appointment.mobile;
//     response(userInfo);
//   });
// }
