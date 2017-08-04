const config = require('../../config/main')(process.env.NODE_ENV);

function Filter(id,fieldId,meta) {
  this.id = id;
  this._fieldId = fieldId;
  if (meta){
    Object.keys(meta).forEach((key)=>{
      this[key] = meta[key];
    })
  }
  this._name = this._name || this.id;
  this._active = false;
  this._inclusive = false;
};

module.exports = Filter;

const limits = function(arr){
  if (Array.isArray(arr) && arr.length > 0){
    this._limits = [Math.min(...arr),Math.max(...arr)];
    this._range = this._limits.slice(0);
  }
  return this._limits;
}

const limitsHigh = function(value){
  if (typeof value === 'number') {
    this._limits[1] = value;
    this._limits[0] = Math.min(this._limits[0],value);
    if (this._limits[0] > this._range[0] || this._limits[1] < this._range[1]){
      this.range(this._limits)
    }
  }
  return this._limits[1];
}

const limitsLow = function(value){
  if (typeof value === 'number') {
    this._limits[0] = value;
    this._limits[1] = Math.max(this._limits[1],value);
    if (this._limits[0] > this._range[0] || this._limits[1] < this._range[1]){
      this.range(this._limits)
    }
  }
  return this._limits[0];
}

const range = function(arr){
  if (Array.isArray(arr) && arr.length > 0){
    this._range = [Math.min(...arr),Math.max(...arr,)];
    if (this._limits){
      this._range[0] = Math.max(this._range[0],this._limits[0]);
      this._range[1] = Math.min(this._range[1],this._limits[1]);
    }
    else {
      this._limits = this._range;
    }
  }
  return this._range;
}

const rangeHigh = function(value){
  if (typeof value === 'number') {
    this.range([Math.min(this._range[0],value),value]);
  }
  return this._range[1];
}

const rangeLow = function(value){
  if (typeof value === 'number') {
    this.range([value,Math.max(this._range[1],value)]);
  }
  return this._range[0];
}

Filter.prototype = {
  limits,
  limitsHigh,
  limitsLow,
  range,
  rangeHigh,
  rangeLow
}
