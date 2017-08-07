const d3 = require('d3')
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
  this._inclusive = true;
  this.scaleType('scaleLinear');
};

module.exports = Filter;

const allowedScales = {
    scaleLinear: 'scaleLinear',
    scaleLog: 'scaleLog',
    scaleSqrt: 'scaleSqrt'
};

const f3 = (value) => {
  return Number(d3.format('.3')(value));
}

const scaleType = function(value){
  let result
  if (typeof value === 'string'){
    if (allowedScales[value]){
      let domain = this.scale ? this.scale.domain() : [];
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

const limits = function(arr){
  if (Array.isArray(arr) && arr.length > 0){
    this._limits = [Math.min(...arr),Math.max(...arr)];
    this._range = this._limits.slice(0);
    this.scale.domain(this._limits);
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
    this.scale.domain(this._limits);
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
    this.scale.domain(this._limits);
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

const rangePercent = function(arr){
  if (Array.isArray(arr) && arr.length > 0) {
    this.range(arr.map((a)=>{return this.scale.invert(a)}))
  }
  else {
    arr = [f3(this.scale(this._range[0])),f3(this.scale(this._range[1]))];
  }
  return arr;
}

const rangeHighPercent = function(value){
  if (typeof value === 'number') {
    this.rangeHigh(this.scale.invert(value))
  }
  else {
    value = f3(this.scale(this._range[1]));
  }
  return value;
}

const rangeLowPercent = function(value){
  if (typeof value === 'number') {
    this.rangeLow(this.scale.invert(value))
  }
  else {
    value = f3(this.scale(this._range[0]));
  }
  return value;
}

const active = function(bool){
  if (typeof bool != 'undefined') {
    if (bool){
      this._active = true;
    }
    else {
      this._active = false;
    }
  }
  return this._active;
}

const inclusive = function(bool){
  if (typeof bool != 'undefined') {
    if (bool){
      this._inclusive = true;
    }
    else {
      this._inclusive = false;
    }
  }
  return this._inclusive;
}


Filter.prototype = {
  scaleType,
  limits,
  limitsHigh,
  limitsLow,
  range,
  rangeHigh,
  rangeLow,
  rangePercent,
  rangeHighPercent,
  rangeLowPercent,
  active,
  inclusive
}
