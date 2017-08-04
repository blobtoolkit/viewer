const config = require('../../config/main')(process.env.NODE_ENV);
const io = require('../helpers/io');
const Filter = require('./filter');

function Field(id,dataset_id,meta) {
  this.id = id;
  this.dataset_id = dataset_id;
  let filter = new Filter('default',this.id);
  this.filters = {default:filter};
  if (meta){
    Object.keys(meta).forEach((key)=>{
      this[key] = meta[key];
      if (key == 'range'){
        filter.limits(meta[key]);
      }
    })
  }

  /*
        this._datatype = 'float';
        this._select_step = 1;
        this._selection = [0, Infinity];
        this._dataset = undefined;
        this._logged = false;
*/
};

module.exports = Field;

const loadData = async function() {
  if (this.data) return Promise.resolve(this.data);
  let filePath = this.filePath || config.filePath;
  this.data = await io.readJSON(filePath+'/'+this.dataset_id+'/'+this.id+'.json');
  return Promise.resolve(this.data);
}

const loadDataAtIndex = async function(index) {
  let data = await this.loadData();
  let lastIndex = data.values.length-1;
  let values = [];
  let keys = false;
  let ret;
  if (data.hasOwnProperty('keys')){
    keys = {};
  }
  String(index).split(',').forEach((r) => {
    range = r.split('-');
    if (r.match('-') && (!range[0]||!range[1])){
      ret = Promise.resolve(undefined);
    }
    range[0] = range[0] ? range[0]*1 : 0;
    range[1] = range[1] ? range[1]*1 : range[0];
    if (range[1] < range[0] || range[1] > lastIndex){
      ret = Promise.resolve(undefined);
    }
    else {
      for (var i = range[0]; i <= range[1]; i++){
        if (keys){
          values.push(data.keys[data.values[i]]);
        }
        else {
          values.push(data.values[i])
        }
      }
    }
  })
  ret = ret || Promise.resolve({values})
  return ret;
}

Field.prototype = {
  loadData,
  loadDataAtIndex
}
