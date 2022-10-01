exports.poweredBy = function (req, res, next) {
  res.setHeader('X-Powered-By', 'PHP 7.4.3');
  next();
};
