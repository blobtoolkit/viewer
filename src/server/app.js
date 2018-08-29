const express        = require('express');
const compression    = require('compression')
const bodyParser     = require('body-parser');
const path           = require('path');
const config         = require('../config/main');
const app            = express();

app.use(compression())
app.use(express.static(path.join(__dirname, 'public')));

app.locals.directory = config.filePath;
if (config.cors){
  const cors = require('express-cors');
  app.use(cors(config.cors));
}
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

require('./routes')(app, {});

if (config.https){
  const https = require('https');
  const fs = require('fs');
  var options = {
    key: fs.readFileSync(config.keyFile),
    cert: fs.readFileSync(config.certFile)
  };
  var secureServer = https.createServer(options, app).listen(
    config.api_port,
    function(){
      console.log('BlobToolKit RESTful API server started on https port: ' + config.api_port);
    }
  );
}
else {
  app.listen(
    config.api_port,
    function(){
      console.log('BlobToolKit RESTful API server started on http port: ' + config.api_port);
    }
  );
}
module.exports = app;
