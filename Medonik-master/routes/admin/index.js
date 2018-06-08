var User = require('../../models/user');
var Location = require('../../models/location');

module.exports = function(router, passport) {

	// index page
	router.get('/', isLoggedIn, function(req, res) {
		res.render('index.ejs', {user: req.user});
	});

	// admin login page
	router.get('/login', function(req, res) {
		res.render('auth/login.ejs', { message: req.flash('loginMessage') });
	});

	// admin login
	router.post('/login', passport.authenticate('local-login', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	}));

	// admin signup page
	router.get('/admin/signup', function(req, res) {
		res.render('auth/signup.ejs', { message: req.flash('signupMessage') });
	});

	// admin signup
	router.post('/admin/signup', passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	// customer signup page
	router.get('/signup', function(req, res) {
		Location.find({}, function(err, locations) {
			if(err)
				res.send(err)		
			res.render('customer-signup.ejs', {locations: locations});
		})
	})

	// logout
	router.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});

}

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}