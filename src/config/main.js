require('dotenv').config();

const appRoot = require('app-root-path');
const BTK_HOST = process.env.BTK_HOST || 'localhost'
const BTK_CLIENT_PORT = Number(process.env.BTK_CLIENT_PORT) || 8080
const BTK_API_PORT = Number(process.env.BTK_API_PORT) || 8000
const BTK_API_URL = process.env.BTK_API_URL || BTK_HOST+':'+BTK_API_PORT
const BTK_HTTPS = (String(process.env.BTK_HTTPS) === 'true')
const BTK_ORIGINS = process.env.BTK_ORIGINS ? process.env.BTK_ORIGINS.split(' ') : ['localhost','null',BTK_HOST,(BTK_HTTPS ? 'https' : 'http') + '://'+BTK_HOST+':'+BTK_CLIENT_PORT];
const FILE_PATH = process.env.BTK_FILE_PATH || appRoot + '/demo';

console.log(FILE_PATH)

module.exports = {
  // setting port for server
  'client_port': BTK_CLIENT_PORT,
  // setting port for server
  'api_port': BTK_API_PORT,
  // flag to use https
  'https': BTK_HTTPS,
  // Cors settings
  'cors': {
    allowedOrigins: BTK_ORIGINS
  },
  // API URL
  'apiUrl': BTK_API_URL,
  // url basename
  'basename': process.env.BTK_BASENAME || '',
  // path to read flatfiles
  'filePath': FILE_PATH,
  // Path to write flatfiles
  'outFilePath': process.env.BTK_OUT_FILE_PATH || appRoot + '/files/out',
  // version
  'version': process.env.BTK_VERSION || 'v0.6.0',
  // hostname
  'hostname': BTK_HOST,
  // API URL
  'apiUrl': process.env.BTK_API_URL || (BTK_HTTPS ? 'https' : 'http') + '://'+BTK_HOST+':'+BTK_API_PORT,
  'mode': process.env.NODE_ENV || 'test'
}
