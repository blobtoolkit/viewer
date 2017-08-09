const swaggerJSDoc   = require('swagger-jsdoc');
const config_swagger = require('../config/swagger')

module.exports = function(app, db) {
  // serve swagger
  app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerJSDoc(config_swagger.options));
  });
};
