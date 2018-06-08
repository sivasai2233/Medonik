var async = require('async');
var Customer = require('../models/customer');
var User = require('../models/user');
var Location = require('../models/location');
var crypto = require('../config/crypto');

module.exports = function(router, passport, upload) {

	// GET all customers
	router.get('/', function(req, res) {
		Customer.find({}, function(err, customers) {
			if(err)
				res.json({success: false, error: err.stack});
			res.json({success: true, data: customers});
		})
	});

	// GET One Customer Info
	router.get('/:id', function(req, res) {
		var data = {}
		async.waterfall([
			function(callback) {
				Customer.findById(req.params.id, function(err, customer) {
			        if(err){
						callback(err)
					}
					else {
						data["customer"] = customer;
			        	callback(null, data);
					}
			    });
			},
			function(data, callback) {
				Location.findById(data.customer.serviceLocation, function(err, location) {
					if(err) {
						callback(err)
					}
					else {
						data["location"] = location;
						callback(null, data);
					}
				})
			}
		], function(err, data) {
			if(err) {
				res.json({success: true, error: err})
			}
			else {
				res.json({success: true, customerInfo: data});
			}
		})

	});

	// customer signup
	router.post('/signup', passport.authenticate('customer-signup', {
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	// customer create
	var newUpload = upload.single('avatar');
	router.post('/create', function(req, res) {
		newUpload(req, res, function(error) {
			if(error) {
				res.json({success: false, message: "File too large, maximum size 1 MB"});
			}
			else {
				req.body.avatar = req.file.path;
				User.findOne({email: req.body.email}, function(err, user) {
					if(err) {
						res.json({success: false, message: err.stack});
					}
					if(user) {
						res.json({success: false, message: "Email already exist"});
					}
					else {
						var newUser = new User();
						newUser.email = req.body.email;
						newUser.password = crypto.encrypt(req.body.password);
						newUser.firstName = req.body.firstName;
						newUser.lastName = req.body.lastName;
						newUser.mobile = req.body.mobile;
						newUser.avatar = req.body.avatar;
						newUser.userRole = 2;
						newUser.status = 1;
						newUser.save(function(err, user){
							if(err) {
								res.json({success: false, message: "Error in creating user", error: err.stack})
							} else {
								addCustomer(req.body, function(response) {
									if(response.success) {
										res.json({success: true, message: "New customer created."})
									}
									else {
										deleteUser(user._id, function(resp) {
											console.log("user deleted due to error in creating customer");
											if(response.success) {
												res.json({success: false, message: "Error in creating customer.", error: err.stack});
											}
											else {
												res.json({success: false, message: "Error in creating customer."});
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

	// update customer
	router.post('/update', function(req, res) {
		var customerInfoObj = {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			location: req.body.location,
			mobile: req.body.mobile,
			email: req.body.email,
			serviceLocation: req.body.serviceLocation
		};
		Customer.findByIdAndUpdate(req.body._id, {$set: customerInfoObj}, function(err) {
			if(err) {
				res.json({success: false, error: err.stack});
			}
			else {
				res.json({success: true, message: "User Updated."});
			}
		});
	})

	function addCustomer(customer, callback) {
		var newCustomer 			= new Customer();
		newCustomer.firstName 		= customer.firstName
		newCustomer.lastName 		= customer.lastName
		newCustomer.avatar 			= customer.avatar
		newCustomer.location 		= customer.location
		newCustomer.mobile 			= customer.mobile
		newCustomer.email 			= customer.email
		newCustomer.serviceLocation = customer.serviceLocation
		newCustomer.status 			= 1
		newCustomer.isVerified 		= 0
		newCustomer.save(function(err) {
			if(err)
				callback({success: false, error: err.stack})
			callback({success: true, message: "New customer created."})
		})
	}

	function deleteUser(userId, callback) {
		User.remove({_id: userId}, function(err, removedUser) {
			if(err)
				callback({success: false, message: "Error in deleting user", error: err.stack});
			callback({success: true})
		})
	}

}
