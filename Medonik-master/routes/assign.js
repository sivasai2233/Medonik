//var AssignFOS = require('../models/assign-fos');
var AssignDoctor = require('../models/assign-doctors');
//var FOS = require('../models/fos');
var Doctor = require('../models/doctor');
var Patient = require('../models/patient');

var async = require('async');

module.exports = function(router) {
  // GET all assigned fos
  router.get('/assigned-fos-list', function(req, res) {
    AssignFOS.find({}, function(err, assignedFosList) {
      if (err) {
        res.json({ success: false, error: err.stack });
      } else {
        res.json({ success: true, data: assignedFosList });
      }
    });
  });

  // Temporary : FOS Delete Assign
  router.post('/delete-assigned-fos', function(req, res) {
    AssignFOS.findByIdAndRemove(req.body.id, function(err, assignedFosList) {
      if (err) {
        res.json({ success: false, error: err.stack });
      } else {
        res.json({ success: true, message: 'Assign removed' });
      }
    });
  });

  // GET all assigned doctor
  router.get('/assigned-doctor-list', function(req, res) {
    AssignDoctor.find({}, function(err, assignedDocList) {
      if (err) {
        res.json({ success: false, error: err.stack });
      } else {
        res.json({ success: true, data: assignedDocList });
      }
    });
  });

  // Temporary : Doctor Delete Assign
  router.post('/delete-assigned-doc', function(req, res) {
    AssignDoctor.findByIdAndRemove(req.body.id, function(err, assignedFosList) {
      if (err) {
        res.json({ success: false, error: err.stack });
      } else {
        res.json({ success: true, message: 'Assign removed' });
      }
    });
  });

  // GET assigned FOS info by patientId
  router.get('/get-assigned-fos/:patientId', function(req, res) {
    var tempObj = {};
    var resultArr = [];
    async.waterfall(
      [
        function(callback) {
          AssignFOS.find({ patientId: req.params.patientId }, function(
            err,
            assignedFosList
          ) {
            if (err) {
              callback(err);
            } else {
              callback(null, assignedFosList);
            }
          });
        },
        function(assignedFosList, callback) {
          FOS.find({}, function(err, fosList) {
            if (err) {
              callback(err);
            } else {
              callback(null, assignedFosList, fosList);
            }
          });
        },
        function(assignedFosList, fosList, callback) {
          var tempObj = {};
          for (var i = 0; i < assignedFosList.length; i++) {
            tempObj['assignInfo'] = assignedFosList[i];
            for (var j = 0; j < fosList.length; j++) {
              if (fosList[j]._id == assignedFosList[i].fosId) {
                tempObj['fosInfo'] = fosList[j];
              }
            }
            resultArr.push(tempObj);
            tempObj = {};
          }
          callback(null, resultArr);
        }
      ],
      function(err, data) {
        if (err) {
          res.json({ success: false, error: err.stack });
        } else {
          res.json({ success: true, data: data });
        }
      }
    );
  });

  // GET assigned doctor info by patientId
  router.get('/get-assigned-doctor/:patientId', function(req, res) {
    var tempObj = {};
    var resultArr = [];
    async.waterfall(
      [
        function(callback) {
          AssignDoctor.find({ patientId: req.params.patientId }, function(
            err,
            assignedDocList
          ) {
            if (err) {
              callback(err);
            } else {
              callback(null, assignedDocList);
            }
          });
        },
        function(assignedDocList, callback) {
          Doctor.find({}, function(err, docList) {
            if (err) {
              callback(err);
            } else {
              callback(null, assignedDocList, docList);
            }
          });
        },
        function(assignedDocList, docList, callback) {
          var tempObj = {};
          for (var i = 0; i < assignedDocList.length; i++) {
            tempObj['assignInfo'] = assignedDocList[i];
            for (var j = 0; j < docList.length; j++) {
              if (docList[j]._id == assignedDocList[i].doctorId) {
                tempObj['docInfo'] = docList[j];
              }
            }
            resultArr.push(tempObj);
            tempObj = {};
          }
          callback(null, resultArr);
        }
      ],
      function(err, data) {
        if (err) {
          res.json({ success: false, error: err.stack });
        } else {
          res.json({ success: true, data: data });
        }
      }
    );
  });

  // POST add new fos
  router.post('/assign-new-fos', function(req, res) {
    var newAssign = new AssignFOS(req.body);
    newAssign.save(function(err) {
      if (err) {
        res.json({ success: false, error: err.stack });
      } else {
        res.json({ success: true, message: 'FOS Assigned successfully.' });
      }
    });
  });

  // POST add new doctor
  router.post('/assign-new-doctor', function(req, res) {
    var newAssign = new AssignDoctor(req.body);
    newAssign.save(function(err) {
      if (err) {
        res.json({ success: false, error: err.stack });
      } else {
        res.json({ success: true, message: 'Doctor Assigned successfully.' });
      }
    });
  });

  // GET Patient info by Doctor
  router.get('/get-assigned-patient-doc/:docId', function(req, res) {
    async.waterfall(
      [
        function(callback) {
          AssignDoctor.find({ doctorId: req.params.docId }, function(
            err,
            assignPatientList
          ) {
            if (err) {
              callback(err);
            } else {
              callback(null, assignPatientList);
            }
          });
        },
        function(assignPatientList, callback) {
          Patient.find({}, function(err, patients) {
            if (err) {
              callback(err);
            } else {
              callback(null, assignPatientList, patients);
            }
          });
        },
        function(assignPatientList, patients, callback) {
          var resultArr = [];
          var tempObj = {};
          for (var i = 0; i < assignPatientList.length; i++) {
            tempObj['assignInfo'] = assignPatientList[i];
            for (var j = 0; j < patients.length; j++) {
              if (patients[j]._id == assignPatientList[i].patientId) {
                tempObj['patientInfo'] = patients[j];
              }
            }
            resultArr.push(tempObj);
            tempObj = {};
          }
          callback(null, resultArr);
        }
      ],
      function(err, resultArr) {
        if (err) {
          res.json({ success: false, error: err.stack });
        } else {
          res.json({ success: true, data: resultArr });
        }
      }
    );
  });

  // GET Patient info by fos
  router.get('/get-assigned-patient-fos/:fosId', function(req, res) {
    async.waterfall(
      [
        function(callback) {
          AssignFOS.find({ fosId: req.params.fosId }, function(
            err,
            assignPatientList
          ) {
            if (err) {
              callback(err);
            } else {
              callback(null, assignPatientList);
            }
          });
        },
        function(assignPatientList, callback) {
          Patient.find({}, function(err, patients) {
            if (err) {
              callback(err);
            } else {
              callback(null, assignPatientList, patients);
            }
          });
        },
        function(assignPatientList, patients, callback) {
          var resultArr = [];
          var tempObj = {};
          for (var i = 0; i < assignPatientList.length; i++) {
            tempObj['assignInfo'] = assignPatientList[i];
            for (var j = 0; j < patients.length; j++) {
              if (patients[j]._id == assignPatientList[i].patientId) {
                tempObj['patientInfo'] = patients[j];
              }
            }
            resultArr.push(tempObj);
            tempObj = {};
          }
          callback(null, resultArr);
        }
      ],
      function(err, resultArr) {
        if (err) {
          res.json({ success: false, error: err.stack });
        } else {
          res.json({ success: true, data: resultArr });
        }
      }
    );
  });
};
