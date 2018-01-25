// command line tool to convert a blobDB to btk format

const parseArgs = require('minimist')(process.argv.slice(2),{boolean:['a','b']})
const Dataset = require('../server/models/dataset');
const io = require('../server/functions/io');

main();

async function main() {
  let blobDBFile = parseArgs['_'][0];
  let outFilePath = parseArgs['_'][1];
  let bool = await io.fileExists(blobDBFile)
  if (!bool || !outFilePath){
    return usage();
  }
  let id = outFilePath.match(/([^\/]*)\/*$/)[1]
  outFilePath = outFilePath.match(/^(.+?)([^\/]*)\/*$/)[1]
  dataset = new Dataset(id);
  dataset.loadBlobDB(blobDBFile).then(()=>{
console.log(dataset)
    dataset.prepareMeta().then(()=>{
      dataset.outFilePath = outFilePath;
      dataset.storeMeta();
      dataset.storeLineages();
      dataset.storeAllValues();
    })
  });
}

function usage(){
  let message = 'Usage: src/server/utilities/importBlobDB.js [options] <blobDB file> <output directory>'
  return message;
}
