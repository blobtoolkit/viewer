const express = require('express');
const auth = require('../middlewares/auth.js')

module.exports = function(app) {
  const apiRoutes = express.Router();

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', auth.authRoutes);

  // protected route
  auth.authRoutes.post('/secure', auth.requireAuth, function(req, res) {
    res.setHeader('content-type', 'application/json');
    res.send('{"content":"available"}')
  });

  // Set url for API group routes
  app.use('/api/v1', apiRoutes);
};
