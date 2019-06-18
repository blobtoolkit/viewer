const Promise = require('promise');
const Path = require('path');
const mkdirp = require('mkdirp-promise');
const stat = Promise.denodeify(require('fs').stat);
const readFile = Promise.denodeify(require('fs').readFile);
const writeFile = Promise.denodeify(require('fs').writeFile);
const waitOn = require('../../shared/functions/utils').waitOn;

const absolutePath = (path) => {
  if (path.match(/^\.\./)) path = Path.join(__dirname,path);
  return Promise.resolve(path);
}

const fileExists = async (filename) => {
  let abs_path = await absolutePath(filename);
  return stat(abs_path)
    .then(() => { return true })
    .catch(() => { return false })
}

const readJSON = async (filename) => {
  let abs_path = await absolutePath(filename);
  return readFile(abs_path, 'utf8')
    .then(JSON.parse)
    .catch((err) => { return undefined })
}

const writeJSON = async (filename, data) => {
  let abs_path = await absolutePath(filename);
  let match = abs_path.match(/^(.+)\/(.+)$/,'');
  let ready = await mkdirp(match[1]);
  let path = await waitOn(abs_path,ready);
  return writeFile(path, JSON.stringify(data))
    .then(() => { return true })
    .catch((err) => { return err })
}

module.exports = {
  absolutePath,
  fileExists,
  readJSON,
  writeJSON
}
