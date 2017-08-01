const defaults = {
  // Secret key for JWT signing and encryption
  'secret': 'super secret passphrase',
  // Database connection information
  'dbhost': 'mongodb://localhost:27017/test',
  // Setting port for server
  'port': process.env.PORT || 8443,
  // flag to use https
  'https': false,
  // Cors settings
  'cors': {
    allowedOrigins: [
      'localhost', 'null'
    ]
  },
  // Path to flatfile directory
  'filePath': '/Library/WebServer/Documents/visualisation/btk-promise/test/files/datasets',
  // version
  'version': '0.0.1',
  // Path to flatfile directory
  'hostname': 'localhost'
}

module.exports = function(mode){
  let obj = JSON.parse(JSON.stringify(defaults));
  obj.mode = mode || 'local';
  if (mode == 'test'){
    obj.dbhost = 'mongodb://localhost:27018/test'
  }
  if (mode == 'staging'){
    // modified settings for staging environment
    obj.filePath = '/path/to/staging/data'
  }
  if (mode == 'production'){
    // modified settings for production environment
    obj.filePath = '/path/to/production/data'
  }
  return obj;
}
