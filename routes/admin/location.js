var Location = require('../../models/location');

module.exports = function(router) {
  // get all locations
  router.get('/locations/', function(req, res) {
    Location.find({}, function(err, locations) {
      if (err) res.json({ success: false, error: err.stack });
      else res.json({ success: true, data: locations });
    });
  });

  // get one location
  router.get('/location/:id', function(req, res) {
    Location.findById(req.params.id, function(err, location) {
      if (err) {
        res.json({ success: false, error: err.stack });
      } else {
        res.json({ success: true, data: location });
      }
    });
  });

  // create
  router.post('/location/create', function(req, res) {
    Location.findOne({ location: req.body.location }, function(err, user) {
      if (err) {
        res.json({ success: false, error: err.stack });
      }
      if (user) {
        res.json({ success: false, error: 'Location already exists' });
      } else {
        var newLocation = new Location(req.body);
        newLocation.save(function(err, info) {
          if (err) {
            res.json({ success: false, error: err.stack });
          } else {
            res.json({
              success: true,
              message: 'New Location created successfully'
            });
          }
        });
      }
    });
  });

  //update location
  router.post('/location/update', function(req, res) {
    var id = req.body._id;
    Location.findOneAndUpdate(
      { _id: id },
      { $set: { location: req.body.location, status: req.body.status } },
      function(err, updatedInfo) {
        if (err) {
          res.json({ success: false, error: err.stack });
        } else {
          res.json({
            success: true,
            data: updatedInfo,
            message: 'Location updated successfully'
          });
        }
      }
    );
  });

  //delete location
  router.delete('/location/delete/:id', function(req, res) {
    Location.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { status: 0 } },
      function(err, deletedInfo) {
        if (err) {
          res.json({ success: false, error: err.stack });
        } else {
          res.json({
            success: true,
            data: deletedInfo,
            message: 'Location deleted successfully'
          });
        }
      }
    );
  });
};
