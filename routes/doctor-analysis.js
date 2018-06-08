var DocAnalysis = require('../models/doctor-analysis');

module.exports = function(router) {
    // GET All Analysis
    router.get('/analysis/all', function(req, res) {
        DocAnalysis.find({}, function(err, analysisList) {
            if(err) {
                res.json({success: false, error: err.stack});
            }
            else {
                res.json({success: true, data: analysisList})
            }
        })
    });

    router.get('/analysis/:id', function(req, res) {
        DocAnalysis.findOne({_id: req.params.id}, function(err, result) {
            if(err) {
                res.json({success: false, error: err.stack});
            }
            else {
                res.json({success: true, data: result});
            }
        })
    });

    // GET Analysis By PatientId
    router.get('/analysis/get-by-patient/:patientId', function(req, res) {
        DocAnalysis.find({patientId: req.params.patientId}, function(err, result) {
            if(err) {
                res.json({success: false, error: err.stack});
            }
            else {
                res.json({success: true, data: result})
            }
        })
    });

    // Create Analysis
    router.post('/analysis/create', function(req, res) {
        var newAnalysis = new DocAnalysis(req.body);
        newAnalysis.save(function(err) {
            if(err) {
                res.json({success: false, error: err.stack});
            }
            else {
                res.json({success: true, message: "Analysis created."})
            }
        })
    });

    // Update analysis
    router.post('/analysis/update', function(req, res) {
        DocAnalysis.findByIdAndUpdate(req.body._id, {$set: req.body}, function(err, result) {
            if(err) {
                res.json({success: false, error: err.stack});
            }
            else {
                res.json({success: true, message: "Analysis updated."});
            }
        });
    });

}
