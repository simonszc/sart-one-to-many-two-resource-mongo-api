'use strict';

module.exports = function(req, res, next) {
  req.query.page = req.query.page || 0;
  req.query.pagesize = req.query.pagesize || 50;
  req.query.offset = req.query.offset || 0;
  if (typeof(req.query.pagesize !== 'Number')) {
    req.query.pagesize = new Number(req.query.pagesize);
  };
  if (typeof(req.query.page !== 'Number')) {
    req.query.page = new Number(req.query.page);
  };
  if (typeof(req.query.pagesize !== 'Number')) {
    req.query.offset = new Number(req.query.offset);
  };
  if (req.query.pagesize  < 1 ) req.query.pagesize = 1;
  if (req.query.page < 1) req.query.page = 1;
  if (req.query.offset < 0) req.query.offset = 0;
  next();
};
