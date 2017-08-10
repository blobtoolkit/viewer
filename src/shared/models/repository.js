const config_main = require('../../config/main');
const io = require('../../server/functions/io');

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
