const express        = require('express');
const bodyParser     = require('body-parser');
const path           = require('path')
const config         = require('./config/main')(process.env.NODE_ENV);
const app            = express();

app.use(express.static(path.join(__dirname, 'server/public')));

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
    key: fs.readFileSync('../certificates/private.key'),
    cert: fs.readFileSync('../certificates/certificate.pem')
  };
  var secureServer = https.createServer(options, app).listen(
    config.port,
    function(){
      console.log('BlobToolKit RESTful API server started on https port: ' + config.port);
    }
  );
}
else {
  app.listen(
    config.port,
    function(){
      console.log('BlobToolKit RESTful API server started on http port: ' + config.port);
    }
  );
}
module.exports = app;
