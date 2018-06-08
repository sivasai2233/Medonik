var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var crypto = require('./crypto');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // admin signup
  passport.use(
    'local-signup',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      function(req, email, password, done) {
        process.nextTick(function() {
          User.findOne({ email: email }, function(err, user) {
            if (err) return done(err);
            if (user) {
              return done(
                null,
                false,
                req.flash('signupMessage', 'That email already taken')
              );
            } else {
              var newUser = new User();
              newUser.email = email;
              newUser.password = crypto.encrypt(password);
              newUser.firstName = req.body.first_name;
              newUser.lastName = req.body.last_name;
              newUser.mobile = req.body.mobile;
              newUser.userRole = 1;
              newUser.status = 1;
              newUser.save(function(err) {
                if (err) throw err;
                return done(null, newUser);
              });
            }
          });
        });
      }
    )
  );

  // login
  passport.use(
    'local-login',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      function(req, email, password, done) {
        process.nextTick(function() {
          User.findOne({ email: email, status: 1 }, function(err, user) {
            if (err) return done(err);
            if (!user)
              return done(
                null,
                false,
                req.flash('loginMessage', 'No User found')
              );
            if (user.password != crypto.encrypt(password)) {
              return done(
                null,
                false,
                req.flash('loginMessage', 'invalid password')
              );
            }
            return done(null, user);
          });
        });
      }
    )
  );
};
