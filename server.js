var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);
var permission = require('./config/permission');

var app = express();

// Required Files
var secret = require('./config/secret');

// View engine setup yes
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Database connection
var configDB = require('./config/database');
mongoose.connect(configDB.url);

// Usage Setups
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: secret.key,
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 15 * 60,
      autoRemove: 'interval',
      autoRemoveInterval: 30
    })
  })
);

// file upload multer
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './assets/uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname + '-' + Date.now() + '.jpg');
  }
});
var upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 }
});

// Passport Setup
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Static Files Config
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/app', express.static(path.join(__dirname, 'app')));

// Router Config
var indexRouter = express.Router();
require('./routes/admin/index')(indexRouter, passport);
app.use('/', indexRouter);

var userRouter = express.Router();
require('./routes/admin/user')(userRouter, passport, upload);
app.use('/user', permission(0, 1), userRouter);

var apiRouter = express.Router();
require('./routes/api')(apiRouter, upload);
require('./routes/admin/location')(apiRouter);
require('./routes/admin/specialization')(apiRouter);
require('./routes/patient')(apiRouter, upload);
require('./routes/doctor')(apiRouter, upload);
require('./routes/appointment')(apiRouter);
require('./routes/chart')(apiRouter);
require('./routes/doctor-analysis')(apiRouter);
app.use('/api', apiRouter);

var customerRouter = express.Router();
require('./routes/customer')(customerRouter, passport, upload);
app.use('/customer', customerRouter);

// var appointmentRouter = express.Router();
// require('./routes/appointment')(appointmentRouter, upload);
// app.use('/appointment', permission(3), appointmentRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
