require('dotenv').config();

const appRoot = require('app-root-path');
const BTK_HOST = process.env.BTK_HOST || 'localhost'
const BTK_PORT = Number(process.env.BTK_PORT) || 8080
const BTK_API_URL = process.env.BTK_API_URL || BTK_HOST+':8000'

const BTK_HTTPS = (String(process.env.BTK_HTTPS) === 'true')
const BTK_ORIGINS = process.env.BTK_ORIGINS ? process.env.BTK_ORIGINS.split(' ') : ['localhost','null',BTK_HOST,(BTK_HTTPS ? 'https' : 'http') + '://'+BTK_HOST+':8080'];
const FILE_PATH = process.env.BTK_FILE_PATH || appRoot + 'test/files/datasets';

module.exports = {
  // setting port for server
  'port': BTK_PORT,
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
  'filePath': process.env.BTK_FILE_PATH || appRoot + '/test/files/datasets',
  // Path to write flatfiles
  'outFilePath': process.env.BTK_OUT_FILE_PATH || appRoot + '/test/files/out',
  // version
  'version': process.env.BTK_VERSION || 'v0.4.9',
  // hostname
  'hostname': BTK_HOST,
  // API URL
  'apiUrl': process.env.BTK_API_URL || (BTK_HTTPS ? 'https' : 'http') + '://'+BTK_HOST+':'+BTK_PORT
}
