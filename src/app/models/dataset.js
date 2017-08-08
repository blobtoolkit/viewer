const config = require('../../config/main')(process.env.NODE_ENV);
const io = require('../helpers/io');
const Field = require('./field');
const waitOn = require('../helpers/utils').waitOn;
const newField = require('../helpers/utils').newField;
const asKeyValue = require('../helpers/utils').asKeyValue;
const groupValuesBy = require('../helpers/utils').groupValuesBy;
const valueAtPath = require('../helpers/utils').valueAtPath;
const removeNestedKeys = require('../helpers/utils').removeNestedKeys;

function Dataset(id) {
  this.id = id;
  this.fields = {};
};

module.exports = Dataset;

const loadBlobDB = async function(file = this.blobDBFile) {
  if (this.blobDB) return Promise.resolve(this.blobDB);
  if (!file) return Promise.reject(Error('Cannot loadBlobDB without a filename'))
  this.blobDB = await io.readJSON(file);
  this.blobDBFile = file;
  return Promise.resolve(this.blobDB);
}

const prepareMeta = async function() {
  if (this.meta) return Promise.resolve(this.meta);
  let json = await this.loadBlobDB();
  let meta = {}
  meta.filePath = config.filePath;
  meta.id = json.title.replace(/blobdb/i,'').replace(/json/i,'').replace(/[\W]+/,'');
  meta.name = json.title;
  meta.description = json.description || 'imported from '+meta.name;
  meta.records = json.seqs;
  meta.record_type = 'contigs';
  let template = {}
  let values = {};
  let fields = [];
  meta.fields = fields;
  fields.push(this.addField('gc',{name:'GC',description:'per contig GC percentage',type:'variable',datatype:'float',range:[0,100],preload:true,blobDBpath:['gc']}))
  fields.push(this.addField('length',{name:'Length',description:'per contig length',type:'variable',datatype:'integer',range:[0,json.length],preload:true,blobDBpath:['length']}))
  fields.push(this.addField('ncount',{name:'N-count',description:'Ns per contig',type:'variable',datatype:'integer',range:[0,json.n_count],blobDBpath:['n_count']}))

  let covLibs = [];
  let readCovLibs = [];
  Object.keys(json.covLibs).forEach((key) => {
    let lib = json.covLibs[key];
    covLibs.push(this.addField(key+'_cov',{name:lib.name,blobDBpath:['covs',key]}))
    readCovLibs.push(this.addField(key+'_read_cov',{name:lib.name,blobDBpath:['read_cov',key]}))
  })
  fields.push(this.addField('covs',{name:'Coverage',description:'coverage per contig',type:'variable',datatype:'float',range:[0,100000],children:covLibs}))
  fields.push(this.addField('read_cov',{name:'Read coverage',description:'read coverage per contig',type:'variable',datatype:'float',range:[0,100000],children:readCovLibs}))
  let  hitLibs = [];
  Object.keys(json.hitLibs).forEach((key) => {
    let lib = json.hitLibs[key];
    hitLibs.push(this.addField(key,{name:lib.name,blobDBpath:['hits',key]}))
  })
  fields.push(this.addField('hits',{name:'Hits',description:'Blast hit taxonomy IDs',type:'hit',datatype:'array',lookup:'ncbi_taxonomy',children:hitLibs}))
  let taxrules = [];
  let levels = ['superkingdom','phylum','order','family','genus','species'];
  let taxfields = [];
  json.taxrules.forEach((rule) => {
    let taxlevels = [];
    levels.forEach((level) => {
      let data = [];
      data.push(this.addField(rule+'_'+level+'_score',{name:'score',type:'variable',datatype:'float',range:[0,1000],blobDBpath:['taxonomy',rule,level,'score']}))
      data.push(this.addField(rule+'_'+level+'_cindex',{name:'c_index',type:'variable',datatype:'integer',range:[0,100],blobDBpath:['taxonomy',rule,level,'c_index']}))
      taxlevels.push(this.addField(rule+'_'+level,{name:level,data:data,blobDBpath:['taxonomy',rule,level,'tax']}))
    })
    taxrules.push(this.addField(rule,{children:taxlevels}))
  })
  fields.push(this.addField('taxonomy',{name:'Taxonomy',description:'BLAST-assigned taxonomy',type:'category',datatype:'string',children:taxrules}))

  this.meta = meta; //await waitOn(meta,json);
  return Promise.resolve(this.meta);
}

const storeMeta = async function() {
  if (!this.meta) return Promise.reject(Error('Cannot storeMeta if meta is undefined'))
  let filePath = this.filePath || config.filePath;
  removeNestedKeys(this.meta.fields,['filters','scale'],['_data','_children'])
  let success = await io.writeJSON(filePath+'/'+this.id+'/meta.json',this.meta);
  return success;
}

const loadMeta = async function() {
  if (!this.meta){
    let filePath = this.filePath || config.filePath;
    this.meta = await io.readJSON(filePath+'/'+this.id+'/meta.json');
  }
  if (this.meta.hasOwnProperty('id')){
    this.addFields(this.meta.fields);
  }
  return Promise.resolve(this.meta);
}

const addFields = function(fields,meta = {}) {
  fields.forEach((f) => {
    Object.keys(f).forEach((key) => {
      if (key != 'children' && key != 'data'){
        meta[key] = f[key];
      }
    })
    if (f.children){
      this.addFields(f.children,meta);
    }
    else {
      this.addField(f.id,meta);
      if (f.data){
        this.addFields(f.data,meta);
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

const storeLineages = async function(){
  let lineages = this.blobDB.lineages;
  let levels = Object.keys(lineages[Object.keys(lineages)[0]]);
  let values = {};
  Object.keys(lineages).forEach((taxid) => {
    values[taxid] = [],
    levels.forEach((level,i) => {
      values[taxid][i] = lineages[taxid][level] || undefined;
    })
  })
  let filePath = this.filePath || config.filePath;
  let success = await io.writeJSON(filePath+'/'+this.id+'/lineages.json',{keys:levels,values:values});
  return success;
}

const storeValues = async function(id,field){
  field = field || this.meta.fields.find(function(f){return f.id == id})
  let values = [];
  let successes = []
  if (field.children){
    field.children.forEach(async (child) => {
      let success = this.storeValues(child.id,child)
      successes.push(success);
    })
  }
  else {
    this.blobDB.order_of_blobs.forEach(async (contig) => {
      let val = valueAtPath(this.blobDB.dict_of_blobs[contig],field.blobDBpath)
      if (field.blobDBpath[0] == 'hits'){
        value = await groupValuesBy((val || []),'taxId','score')
      }
      else {
        value = val;
      }
      values.push(value);
    });
    let filePath = this.filePath || config.filePath;
    if (field.blobDBpath[0] == 'taxonomy' && field.blobDBpath[field.blobDBpath.length-1] == 'tax'){
      let success;
      let result = asKeyValue(values)
      success = io.writeJSON(filePath+'/'+this.id+'/'+field.id+'.json',result);
      successes.push(success);
    }
    else {
      let result = {values:values};
      let success = io.writeJSON(filePath+'/'+this.id+'/'+field.id+'.json',result);
      successes.push(success);
    }
  }
  if (field.data){
    field.data.forEach((child) => {
      let success = this.storeValues(child.id,child)
      successes.push(success);
    })
  }
  return Promise.all(successes)
}

const storeAllValues = function(){
  let successes = []
  this.meta.fields.forEach(async (field)=>{
    let out = this.storeValues(field.id)
    successes = successes.concat(out)
  })
  return Promise.all(successes);
}

Dataset.prototype = {
  loadBlobDB,
  prepareMeta,
  loadMeta,
  addFields,
  addField,
  storeMeta,
  storeLineages,
  storeValues,
  storeAllValues
}
