const fs = require('fs');
const read = require('read-yaml');
const config = require('../../config/main');
const fileExists = require('../functions/io').fileExists;
const dataDirectory = config.filePath;

const parseMeta = (obj) => {
  let meta = {}
  if (!obj) return meta
  if (obj.hasOwnProperty('assembly')){
    let props = ['accession','alias','bioproject','biosample','prefix']
    props.forEach(prop=>{
      if (obj.assembly.hasOwnProperty(prop)){
        meta[prop] = obj.assembly[prop]
      }
    })
  }
  if (obj.hasOwnProperty('taxon')){
    let props = ['genus','name','taxid','phylum']
    Object.keys(obj.taxon).forEach(prop=>{
      meta[prop] = obj.taxon[prop]
    })
  }
  if (meta.hasOwnProperty('name')){
    meta.taxon_name = meta.name
    delete meta.name
  }
  if (meta.hasOwnProperty('prefix')){
    meta.name = meta.prefix
    delete meta.prefix
  }
  else {
    meta.name = obj.id
  }
  return meta
}

const readMeta = (dir,md) => {
  md = md || []
  fs.readdirSync(dir).forEach(file => {
    let path = dir+'/'+file
    if (fs.statSync(path).isDirectory()){
      readMeta(path,md)
    }
    else if (file == 'meta.json' && fs.statSync(path).isFile()){
      let dsMeta = parseMeta(read.sync(path))
      dsMeta.id = dir.replace(/^.+\//,'')
      if (config.dataset_table){
        let sumpath = dir+'/summary.json'
        fileExists(sumpath).then((bool)=>{
          if (bool){
            let summary = read.sync(sumpath)
            if (summary.hasOwnProperty('summaryStats')){
              dsMeta.summaryStats = summary.summaryStats
            }
          }
        })
      }
      md.push(dsMeta)
    }
  })
  return md
}

const generateIndex = meta => {
  let fields = {}
  let ctr = 0
  let terms = {}
  meta.forEach((m,i)=>{
    Object.keys(m).forEach(k=>{
      if (!fields.hasOwnProperty(k)){
        fields[k] = ctr
        ctr++
      }
      if (!terms.hasOwnProperty(m[k])){
        terms[m[k]] = {}
      }
      if (!terms[m[k]].hasOwnProperty(fields[k])){
        terms[m[k]][fields[k]] = []
      }
      terms[m[k]][fields[k]].push(i)
    })
  })
  let keys = Object.keys(fields).sort((a, b) => fields[a] - fields[b])
  let values = {}
  Object.keys(terms).forEach(k=>{
    if (!values.hasOwnProperty(k)){
      values[k] = []
    }
    Object.keys(terms[k]).forEach(f=>{
      values[k].push({i:terms[k][f],f})
    })
  })
  let index = {keys,values}
  return index
}

const ranks = ['superkingdom', 'kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species', 'taxon_name', 'id']

const generateTree = (meta) => {
  let tree = {n: 0, r: 'root', d:{}, c:0}
  let nodes = ['root']
  meta.forEach((ds,i) => {
    let parent_node = tree
    ranks.forEach(rank=>{
      let skip
      if (rank == 'id'){
        let assembly = ds[rank]
        parent_node.d[assembly] = {
          n: nodes.length,
          // assembly,
          p: parent_node.id
        }
        nodes.push(assembly)
        parent_node.c++
      }
      else {
        let taxon = ds[rank]
        if (!taxon){
          let parent = nodes[parent_node.n]
          taxon = parent.match('undef') ? parent : `${parent}-undef`
        }
        if (!parent_node.d[taxon]){
          if (rank == 'taxon_name' && taxon == nodes[parent_node.n]){
            skip = true
          }
          else {
            parent_node.d[taxon] = {
              n: nodes.length,
              r: rank,
              p: parent_node.id,
              d: {},
              c: 0
            }
            nodes.push(taxon)
          }
        }
        if (!skip){
          parent_node.c++
          parent_node = parent_node.d[taxon]
        }
      }
    })
  })
  return tree
}

const meta = readMeta(dataDirectory)

const index = generateIndex(meta)

const keys = Object.keys(index.values)

const tree = generateTree(meta)

const autocomplete = term => {
  query = term.toUpperCase()
  let results = []
  if (term.match(/^all$/i)){
    results.push({
      term:'all',
      field:'all records',
      names:meta.map(o=>o.name)
    })
  }
  else {
    keys.forEach(k=>{
      if (k.substr(0, query.length).toUpperCase() == query){
        index.values[k].forEach(entry=>{
          results.push({
            term:k,
            field:index.keys[entry.f],
            names:entry.i.map(i=>meta[i].name)
          })
        })
      }
    })
  }
  return results
}

const search = term => {
  if (term.match(/^all$/i)) return meta
  if (!index.values[term]) return []
  let arr = []
  let ids = {}
  index.values[term].forEach(entry=>{
    entry.i.forEach(i=>{
      if (!ids[meta[i].id]){
        arr.push(meta[i])
        ids[meta[i].id] = 1
      }
    })
  })
  return arr
}


module.exports = function(app, db) {
  app.get('/api/v1/search', async (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.json(tree)
  });
  app.get('/api/v1/search/autocomplete/:term', async (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.json(autocomplete(req.params.term))
  });
  app.get('/api/v1/search/:term', async (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.json(search(req.params.term))
  });
};
