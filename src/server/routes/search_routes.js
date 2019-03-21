const fs = require('fs');
const read = require('read-yaml');
const config = require('../../config/main');
const dataDirectory = config.filePath;

const parseMeta = (obj) => {
  let meta = {}
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

const meta = readMeta(dataDirectory)

const index = generateIndex(meta)

const keys = Object.keys(index.values)

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
  index.values[term].forEach(entry=>{
    arr = arr.concat(entry.i.map(i=>meta[i]))
  })
  return arr
}

module.exports = function(app, db) {
  app.get('/api/v1/search/autocomplete/:term', async (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.json(autocomplete(req.params.term))
  });
  app.get('/api/v1/search/:term', async (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.json(search(req.params.term))
  });
  app.get('/api/v1/search', async (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.json([])
  });
};
