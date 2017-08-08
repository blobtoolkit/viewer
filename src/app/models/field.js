const d3 = require('d3')
const config = require('../../config/main')(process.env.NODE_ENV);
const io = require('../helpers/io');
const Filter = require('./filter');

function Field(id,dataset,meta) {
  this._id = id;
  this.dataset = dataset;
  if (meta){
    Object.keys(meta).forEach((key)=>{
      if (key == 'range'){
        this.range(meta[key]);
      }
      else {
        let newkey = key.match(/^_/) ? key : '_'+key
        this[newkey] = meta[key];
      }
    })
  }
  if (this._range){
    this.scaleType(this._scale || 'scaleLinear');
  }
  let filter = new Filter('default',this);
  this.filters = {default:filter};
  if (this._range){
    filter._limits = this._range;
    filter.scale = this.scale;
  }
};

module.exports = Field;

const loadData = async function() {
  if (this.data) return Promise.resolve(this.data);
  let filePath = this.filePath || config.filePath;
  this.data = await io.readJSON(filePath+'/'+this.dataset.id+'/'+this._id+'.json');
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
    let indices = r.split('-');
    if (r.match('-') && (!indices[0]||!indices[1])){
      ret = Promise.resolve(undefined);
    }
    indices[0] = indices[0] ? indices[0]*1 : 0;
    indices[1] = indices[1] ? indices[1]*1 : indices[0];
    if (indices[1] < indices[0] || indices[1] > lastIndex){
      ret = Promise.resolve(undefined);
    }
    else {
      for (var i = indices[0]; i <= indices[1]; i++){
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

const allowedScales = {
    scaleLinear: 'scaleLinear',
    scaleLog: 'scaleLog',
    scaleSqrt: 'scaleSqrt',
    scalePow: 'scalePow',
    scaleOrdinal: 'scaleOrdinal'
};

const scaleType = function(value){
  let result
  if (typeof value === 'string'){
    if (allowedScales[value]){
      let domain = this.scale ? this.scale.domain() : this._range;
      this.scale = d3[allowedScales[value]]().domain(domain).range([0,100]);
      this.scale.scaleType = allowedScales[value];
      result = this.scale.scaleType;
    }
    else {
      result = undefined;
    }
  }
  else {
    result = this.scale.scaleType;
  }
  return result;
}

const range = function(arr){
  if (Array.isArray(arr) && arr.length > 0){
    this._range = [Math.min(...arr),Math.max(...arr)];
    if (this.scale){
      this.scale.domain(this._range);
    }
  }
  return this._range;
}

const rangeHigh = function(value){
  if (typeof value === 'number') {
    this._range[1] = value;
    this._range[0] = Math.min(this._range[0],value);
    this.scale.domain(this._range);
  }
  return this._range[1];
}

const rangeLow = function(value){
  if (typeof value === 'number') {
    this._range[0] = value;
    this._range[1] = Math.max(this._range[1],value);
    this.scale.domain(this._range);
  }
  return this._range[0];
}

const filterToList = async function(arr){
  let low = this.filters['default'].rangeLow();
  let high = this.filters['default'].rangeHigh();
  let inclusive = this.filters['default'].inclusive();
  let filter;
  if (inclusive){
    filter = (value) => { return value >= low && value <= high }
  }
  else {
    filter = (value) => { return value <= low || value >= high }
  }
  let result = await this.loadData().then(()=>{
    let data = this.data;
    let values = data.values;
    let ret = [];
    if (arr){
      arr.forEach(function(i){
        if (filter(values[i])){
          ret.push(i);
        }
      })
    }
    else {
      values.forEach(function(v,i){
        if (filter(v)){
          ret.push(i);
        }
      })
    }
    return ret;
  })
  return Promise.resolve(result)
}

/*
        filterToList: function(list) {
          var ret = [];
          var low = this._filter.lowFilterValue();
          var high = this._filter.highFilterValue();
          var data = this.data();
          list.forEach(function(i){
            if (data[i] >= low && data[i] <= high){
              ret.push(i);
            }
          })
          return ret;
        },
        applyListFilter: function(list) {
          var filtered = [];
          var data = this.data();
          list.forEach(function(i){
            filtered.push(data[i]);
          })
          this.filtered(filtered);
          this.previewData();
        }
*/
Field.prototype = {
  loadData,
  loadDataAtIndex,
  scaleType,
  range,
  rangeHigh,
  rangeLow,
  filterToList
}
