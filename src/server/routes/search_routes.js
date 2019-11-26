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
    let props = ['genus','taxid','phylum']
    Object.keys(obj.taxon).forEach(prop=>{
      meta[prop] = obj.taxon[prop]
    })
    meta.taxon_name = obj.taxon.name
  }
  if (obj.hasOwnProperty('name')){
    meta.name = obj.name
  }
  else {
    meta.name = obj.id
  }
  if (!meta.hasOwnProperty('prefix')){
    meta.prefix = meta.name
  }
  if (obj.hasOwnProperty('revision')){
    meta.revision = obj.revision
  }
  return meta
}

const readMeta = (dir,md) => {
  md = md || []
  versions = {}
  md.forEach((o,i) => {
    if (!versions[o.prefix]){
      versions[o.prefix] = {}
    }
    versions[o.prefix][o.revision] = i
  })
  fs.readdirSync(dir).forEach(file => {
    let path = dir+'/'+file
    if (fs.statSync(path).isDirectory()){
      readMeta(path,md)
    }
    else if (file == 'meta.json' && fs.statSync(path).isFile()){
      let dsMeta = parseMeta(read.sync(path))
      dsMeta.id = dir.replace(/^.+\//,'')
      if (!dsMeta.hasOwnProperty('revision')){
        dsMeta.revision = 0
      }
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
      if (!versions[dsMeta.prefix]){
        versions[dsMeta.prefix] = {}
      }
      versions[dsMeta.prefix][dsMeta.revision] = md.length
      md.push(dsMeta)
      let latest = Math.max(...Object.keys(versions[dsMeta.prefix]))
      Object.keys(versions[dsMeta.prefix]).forEach(version=>{
        md[versions[dsMeta.prefix][version]].latest = latest
      })
    }
  })
  return md
}

const generateIndex = meta => {
  let fields = {}
  let ctr = 0
  let terms = {}
  meta.forEach((m,i)=>{
    if (m.latest == m.revision){
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
    }
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
  let tree = {n: 0, r: 'root', d:{}, a:0, s:0}
  let nodes = ['root']
  let species = {}
  meta.forEach((ds,i) => {
    let spid = ranks.slice(0,8).map(r=>ds[r]).reduce((a,b)=>a+','+b)
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
        parent_node.a++
      }
      else {
        let taxon = ds[rank]
        if (!taxon){
          let parent = String(nodes[parent_node.n])
          if (parent){
            taxon = parent.endsWith('undef') ? parent : `${parent}-undef`
          }
          else {
            parent = 'undef'
          }
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
              a: 0,
              s: 0
            }
            nodes.push(taxon)
          }
        }
        if (!species[spid]){
          parent_node.s++
        }
        if (!skip){
          parent_node.a++
          parent_node = parent_node.d[taxon]
        }
      }
    })
    species[spid] = true
  })
  return tree
}

const meta = readMeta(dataDirectory)

const index = generateIndex(meta)

const keys = Object.keys(index.values)

let tree = {}

if (config.dataset_table){
  tree = generateTree(meta)
}

const autocomplete = term => {
  query = term.toUpperCase()
  let results = []
  if (term.match(/^all$/i)){
    results.push({
      term:'all',
      field:'all records',
      names:meta.filter(o=>o.latest==o.revision).map(o=>o.name)
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
  if (term.match(/^all$/i)) return meta.filter(o=>o.latest==o.revision)
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


const tabulate = term => {
  let json = search(term)
  let byGCA = ''
  let byWGS = ''
  json.forEach(assembly => {
    if (assembly.summaryStats){
      let pctHit = 100 - assembly.summaryStats.stats.noHit * 100
      let pctTarget = assembly.summaryStats.stats.target * 100
      let ratio = 1 / assembly.summaryStats.stats.spanOverN50
      let id = assembly.id
      ratio = ratio ? ratio :  assembly.summaryStats.stats.n50OverSpan
      let string = `${id}\t${pctHit.toPrecision(3)}\t${pctTarget.toPrecision(3)}\t${ratio.toPrecision(2)}`
      byGCA += `${assembly.accession}\t${string}\n`
      if (id.match(/[A-Z]{4,6}\d{2}/)){
        byWGS += `${id}000000\t${string}\n`
      }
    }
  })
  return byGCA + byWGS
}

/**
  * @swagger
  * definitions:
  *   Tree:
  *     properties:
  *       n:
  *         type: integer
  *         description: node ID
  *       r:
  *         type: string
  *         description: rank
  *       a:
  *         type: integer
  *         description: number of assemblies analysed
  *       s:
  *         type: integer
  *         description: number of species with at least one assembly analysed
  *       ta:
  *         type: integer
  *         description: total number of publicly available assemblies
  *       ts:
  *         type: integer
  *         description: number of species with at least one publicly available assembly
  *       d:
  *         type: object
  *         description: descendant nodes
  */
//[{"term":"Diptera","field":"order","names":["ACVV01.1"]}]
/**
  * @swagger
  * definitions:
  *   Term:
  *     properties:
  *       term:
  *         type: string
  *         description: search term
  *       field:
  *         type: string
  *         description: search field
  *       names:
  *         type: array
  *         description: matching dataset identifiers
  *         items:
  *           type: string
  */
/**
 * @swagger
 * parameters:
 *   term:
 *     in: path
 *     name: term
 *     type: string
 *     required: true
 *     description: search term (e.g. Nematoda)
 */

module.exports = function(app, db) {
  /**
   * @swagger
   * /api/v1/search/tree/target:
   *   get:
   *     tags:
   *       - Search
   *     description: Returns tree of all publicly available Eukaryotic genome assemblies
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A tree object
   *         schema:
   *           $ref: '#/definitions/Tree'
   */

  app.get('/api/v1/search/tree/target', async (req, res) => {
    res.sendFile(`${dataDirectory}/targets.json`)
  });
  /**
   * @swagger
   * /api/v1/search/tree/available:
   *   get:
   *     tags:
   *       - Search
   *     description: Returns tree of all analysed genome assemblies
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A tree object
   *         schema:
   *           $ref: '#/definitions/Tree'
   */

  app.get('/api/v1/search/tree/available', async (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.json(tree)
  });
  /**
   * @swagger
   * /api/v1/search/autocomplete/{term}:
   *   get:
   *     tags:
   *       - Search
   *     description: Returns an array of available search terms
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A tree object
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Tree'
   *     parameters:
   *       - $ref: "#/parameters/term"
   */

  app.get('/api/v1/search/autocomplete/:term', async (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.json(autocomplete(req.params.term))
  });
  /**
   * @swagger
   * /api/v1/search/{term}:
   *   get:
   *     tags:
   *       - Search
   *     description: Returns an array of datasets matching a search term
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: An array of Datasets
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Dataset'
   *     parameters:
   *       - $ref: "#/parameters/term"
   */

  app.get('/api/v1/search/:term', async (req, res) => {
    if (req.query && req.query.display == 'tsv'){
      res.setHeader('content-type', 'text/tab-separated-values');
      today = new Date().toISOString().substring(0, 10).replace(/-/g,'')
      res.setHeader('content-disposition', `attachment; filename=BlobToolKit_${today}.tsv`)
      res.send(tabulate(req.params.term))
    }
    else {
      res.setHeader('content-type', 'application/json');
      res.json(search(req.params.term))
    }
  });
};
