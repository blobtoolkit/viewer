const config = require('../../config/main')(process.env.NODE_ENV);
const io = require('../helpers/io');
const waitOn = require('../helpers/utils').waitOn;
const newField = require('../helpers/utils').newField;
const asKeyValue = require('../helpers/utils').asKeyValue;
const groupValuesBy = require('../helpers/utils').groupValuesBy;
const valueAtPath = require('../helpers/utils').valueAtPath;

function Dataset(id) {
  this.id = id;
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
  fields.push(newField('gc',{name:'GC',description:'per contig GC percentage',type:'variable',datatype:'float',range:[0,100],preload:true,blobDBpath:['gc']}))
  fields.push(newField('length',{name:'Length',description:'per contig length',type:'variable',datatype:'integer',range:[0,json.length],preload:true,blobDBpath:['length']}))
  fields.push(newField('ncount',{name:'N-count',description:'Ns per contig',type:'variable',datatype:'integer',range:[0,json.n_count],blobDBpath:['n_count']}))

  let covLibs = [];
  let readCovLibs = [];
  Object.keys(json.covLibs).forEach(function(key){
    let lib = json.covLibs[key];
    covLibs.push(newField(key+'_cov',{name:lib.name,blobDBpath:['covs',key]}))
    readCovLibs.push(newField(key+'_read_cov',{name:lib.name,blobDBpath:['read_cov',key]}))
  })
  fields.push(newField('covs',{name:'Coverage',description:'coverage per contig',type:'variable',datatype:'float',range:[0,100000],children:covLibs}))
  fields.push(newField('read_cov',{name:'Read coverage',description:'read coverage per contig',type:'variable',datatype:'float',range:[0,100000],children:readCovLibs}))
  let  hitLibs = [];
  Object.keys(json.hitLibs).forEach(function(key){
    let lib = json.hitLibs[key];
    hitLibs.push(newField(key,{name:lib.name,blobDBpath:['hits',key]}))
  })
  fields.push(newField('hits',{name:'Hits',description:'Blast hit taxonomy IDs',type:'hit',datatype:'array',lookup:'ncbi_taxonomy',children:hitLibs}))
  let taxrules = [];
  let levels = ['superkingdom','phylum','order','family','genus','species'];
  let taxfields = [];
  taxfields.push(newField());
  json.taxrules.forEach(function(rule){
    let taxlevels = [];
    levels.forEach(function(level){
      let data = [];
      data.push(newField(rule+'_'+level+'_score',{name:'score',type:'variable',datatype:'float',range:[0,1000],blobDBpath:['taxonomy',rule,level,'score']}))
      data.push(newField(rule+'_'+level+'_cindex',{name:'c_index',type:'variable',datatype:'integer',range:[0,100],blobDBpath:['taxonomy',rule,level,'c_index']}))
      taxlevels.push(newField(rule+'_'+level,{name:level,data:data,blobDBpath:['taxonomy',rule,level,'tax']}))
    })
    taxrules.push(newField(rule,{children:taxlevels}))
  })
  fields.push(newField('taxonomy',{name:'Taxonomy',description:'BLAST-assigned taxonomy',type:'category',datatype:'string',children:taxrules}))

  this.meta = meta; //await waitOn(meta,json);
  return Promise.resolve(this.meta);
}

const storeMeta = async function() {
  if (!this.meta) return Promise.reject(Error('Cannot storeMeta if meta is undefined'))
  let filePath = this.filePath || config.filePath;
  let success = await io.writeJSON(filePath+'/'+this.id+'/meta.json',this.meta);
  return success;
}

const loadMeta = async function() {
  if (this.meta) return Promise.resolve(this.meta);
  let filePath = this.filePath || config.filePath;
  this.meta = await io.readJSON(filePath+'/'+this.id+'/meta.json');
  return Promise.resolve(this.meta);
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
      let result = Promise.resolve(asKeyValue(values))
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
  storeMeta,
  storeLineages,
  storeValues,
  storeAllValues
}
