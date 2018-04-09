//if (process.env.NODE_ENV != 'test'){
  require('dotenv').config();
//}
const appRoot = require('app-root-path');
const BTK_HOST = process.env.BTK_HOST || '192.168.1.67'

const BTK_HTTPS = (String(process.env.BTK_HTTPS) === 'true')
const BTK_ORIGINS = process.env.BTK_ORIGINS ? process.env.BTK_ORIGINS.split(' ') : ['localhost','null',BTK_HOST,(BTK_HTTPS ? 'https' : 'http') + '://'+BTK_HOST+':8080'];
const FILE_PATH = process.env.BTK_FILE_PATH || appRoot + 'test/files/datasets';

module.exports = {
  // secret key for JWT signing and encryption
  'secret': process.env.BTK_SECRET || 'default passphrase',
  // salt work factor for encryption
  'workFactor': process.env.BTK_SALT_WORK_FACTOR || 1,
  // database connection information
  'dbHost': process.env.BTK_DB_HOST || 'mongodb://'+BTK_HOST+':27018/test',
  // setting port for server
  'port': Number(process.env.BTK_PORT) || 8000,
  // flag to use https
  'https': BTK_HTTPS,
  // Cors settings
  'cors': {
    allowedOrigins: BTK_ORIGINS
  },
  // path to read flatfiles
  'filePath': process.env.BTK_FILE_PATH || appRoot + '/test/files/datasets',
  // Path to write flatfiles
  'outFilePath': process.env.BTK_OUT_FILE_PATH || appRoot + '/test/files/out',
  // version
  'version': process.env.BTK_VERSION || 'test',
  // hostname
  'hostname': BTK_HOST || '192.168.1.67',
  // location of certificate key file
  'keyFile': process.env.BTK_KEYFILE || appRoot + '/test/ssl/private.key',
  // location of certificate file
  'certFile': process.env.BTK_CERTFILE || appRoot + '/test/ssl/certificate.pem',
  // API URL
  'apiUrl': process.env.BTK_API_URL || (BTK_HTTPS ? 'https' : 'http') + '://'+BTK_HOST+':8000'
}
