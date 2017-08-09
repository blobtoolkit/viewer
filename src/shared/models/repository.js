const config_main = require('../../server/config/main')(process.env.NODE_ENV);
const io = require('../helpers/io');

function Repository(id){
  this.id = id;
};

module.exports = Repository;

const getId = function() {
  return this.id || 'nothing';
}

const loadMeta = () => {
  let path = config_main.filePath;
  return io.readJSON(path+'/meta.json');
}

Repository.prototype = {
  getId,
  loadMeta
}
