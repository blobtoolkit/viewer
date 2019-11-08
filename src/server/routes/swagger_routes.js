const swaggerJSDoc   = require('swagger-jsdoc');
const swaggerUI   = require('swagger-ui-express');
const config_swagger = require('../../config/swagger')

const swaggerSpec = swaggerJSDoc(config_swagger.options)

module.exports = function(app, db) {
  // serve swagger
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
  app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};
