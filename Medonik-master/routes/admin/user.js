var User = require('../../models/user');
var crypto = require('../../config/crypto');

module.exports = function(router, passport, upload) {
  // get all users
  router.get('/all', function(req, res) {
    User.find({}, function(err, users) {
      if (err) res.json({ success: false, error: err.stack });
      else res.json({ success: true, data: users });
    });
  });

  // get user list for users module
  router.get('/', function(req, res) {
    User.find({ userRole: 1 }, function(err, users) {
      if (err) res.json({ success: false, error: err.stack });
      res.json({ success: true, data: users });
    });
  });

  // get one user
  router.get('/:id', function(req, res) {
    User.findOne({ _id: req.params.id }, function(err, user) {
      if (err) res.json({ success: false, error: err.stack });
      else res.json({ success: true, data: user });
    });
  });

  // update user
  router.post('/update', function(req, res) {
    var userObject = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      mobile: req.body.mobile,
      avatar: req.body.avatar,
      status: req.body.status
    };

    if (req.body.password !== '') {
      userObject['password'] = crypto.encrypt(req.body.password);
    }

    User.findByIdAndUpdate(req.body._id, { $set: userObject }, function(err) {
      if (err) {
        res.json({ success: false, error: err.stack });
      } else {
        res.json({ success: true, message: 'User Updated.' });
      }
    });
  });

  // create new user
  var newUpload = upload.single('avatar');
  router.post('/create', function(req, res) {
    newUpload(req, res, function(error) {
      if (error) {
        res.json({
          success: false,
          error: 'File too large, maximum size 1 MB'
        });
      } else {
        req.body.avatar = req.file.path;
        req.body.userRole = 1;
        req.body.status = 1;
        req.body.password = crypto.encrypt(req.body.password);
        User.findOne({ email: req.body.email }, function(err, user) {
          if (err) {
            res.json({ success: false, error: err.stack });
          }
          if (user) {
            res.json({ success: false, error: 'Email already exists' });
          } else {
            var newUser = new User(req.body);
            newUser.save(function(err) {
              if (err) throw err;
              res.json({ success: true, message: 'User created successfully' });
            });
          }
        });
      }
    });
  });

  // delete user
  router.delete('/delete/:id', function(req, res) {
    User.findByIdAndUpdate(req.params.id, { $set: { status: 0 } }, function(
      err
    ) {
      if (err) {
        res.json({ success: false, error: err.stack });
      } else {
        res.json({ success: true, message: 'User deleted.' });
      }
    });
  });

  // update password
  router.post('/password-update', function(req, res) {
    User.findOne({ email: req.body.email }, function(err, userInfo) {
      if (err) {
        res.json({ success: false, error: err.stack });
      } else {
        if (userInfo.password == crypto.encrypt(req.body.currentPassword)) {
          if (userInfo.password == crypto.encrypt(req.body.newPassword)) {
            res.json({
              success: false,
              error: 'New password should current be old password'
            });
          } else {
            console.log(userInfo);
            var newEncryptedPwd = crypto.encrypt(req.body.newPassword);
            User.findByIdAndUpdate(
              userInfo._id,
              { $set: { password: newEncryptedPwd } },
              function(err) {
                if (err) {
                  res.json({ success: false, error: err.stack });
                } else {
                  res.json({ success: true, message: 'Password updated.' });
                }
              }
            );
          }
        } else {
          res.json({ success: false, error: 'Incorrect current password' });
        }
      }
    });
  });
};
