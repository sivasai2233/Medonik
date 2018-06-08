var Specialization = require('../../models/specialization');

module.exports = function(router) {

	// get all locations
	router.get('/specializations/', function(req, res) {
		Specialization.find({}, function(err, locations) {
			if(err)
				res.json({success: false, error: err.stack});
			else
				res.json({success: true, data: locations});
		});
	});

    // get one location
    router.get('/specialization/:id', function(req, res) {
        Specialization.findById(req.params.id, function(err, specialization) {
            if(err) {
				res.json({success: false, error: err.stack});
			}
            else {
				res.json({success: true, data: specialization});
			}
        });
    });

	// create
	router.post('/specialization/create', function(req, res) {
		Specialization.findOne({specialization: req.body.specialization}, function(err, user) {
			if(err) {
				res.json({success: false, error: err.stack});
			}
			if(user) {
				res.json({success: false, error: "Specialization already exists"});
			}
			else {
				var newSpecialization = new Specialization(req.body);
				newSpecialization.save(function(err, info){
					if(err) {
						res.json({success: false, error: err.stack});
					}
					else {
						res.json({success: true, message: "New specialization created successfully"});
					}
				})
			}
		})
	});

	//update specialization
	router.post('/specialization/update', function(req, res) {
	    Specialization.findByIdAndUpdate(req.body._id, {$set: {specialization: req.body.specialization}}, function(err, updatedInfo) {
	        if(err) {
				res.json({success: false, error: err.stack});
			}
	        else {
				res.json({success: true, data: updatedInfo, message: "Specialization updated successfully"});
			}
	    });
	});

    //delete location
    router.delete('/specialization/delete/:id', function(req, res) {
        Specialization.findOneAndUpdate({_id: req.params.id}, {$set: {status: 0}}, function(err, deletedInfo) {
            if(err) {
				res.json({success: false, error: err.stack});
			}
            else {
				res.json({success: true, data: deletedInfo, message: "Specialization deleted successfully"});
			}
        });
    });

}
