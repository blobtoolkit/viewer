const Field = require('./field');
const utils = require('../functions/utils');

function Dataset(id) {
  this.id = id;
  this.fields = {};
};

module.exports = Dataset;

const addFields = function(fields,meta = {}) {
  fields.forEach((f) => {
    Object.keys(f).forEach((key) => {
      if (key != 'children' && key != 'data'){
        meta[key] = f[key];
      }
    })
    if (f.children){
      this.addFields(f.children || f._children,meta);
    }
    else {
      this.addField(f.id || f._id,meta);
      if (f.data || f._data){
        this.addFields(f.data || f._data,meta);
      }
    }
  })
}

const addField = function(fId,meta){
  if (!this.fields.hasOwnProperty(fId)){
    this.fields[fId] = new Field(fId,this,meta);
  }
  return this.fields[fId];
}

Dataset.prototype = {
  addFields,
  addField
}
