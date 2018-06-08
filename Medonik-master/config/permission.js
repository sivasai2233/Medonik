module.exports = function(...allowed) {
  const isAllowed = role => allowed.indexOf(role) > -1;
  // return a middleware
  return (req, res, next) => {
    if (req.user && isAllowed(req.user.userRole)) next();
    else {
      // role is allowed, so continue on the next middleware
      res.status(403).json({ success: false, message: 'Forbidden' }); // user is forbidden
    }
  };
};
