const main = require('./main')(process.env.MODE)

// swagger definition
const swaggerDefinition = {
  info: {
    title: 'BlobToolKit API',
    version: main.version,
    description: 'A RESTful API for BlobToolKit',
  },
  host: main.https ? 'https' : 'http' + '://' + main.hostname + ':' + main.port,
  basePath: '/',
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./src/app/routes/*.js'],
};

module.exports = {
  options: options
}
