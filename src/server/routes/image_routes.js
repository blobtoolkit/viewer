const sharp = require('sharp');

const resize = async (file, width, height) => {
  height = height || width
  let buffer = await sharp(file)
    .resize(width, height, {
      fit: sharp.fit.inside,
      withoutEnlargement: true
    })
    .toFormat('png')
    .toBuffer()
    .then(outputBuffer => outputBuffer)
  return buffer
}


module.exports = function(app, db) {
  var directory = app.locals.directory;
  app.get('/api/v1/image/:dataset_id', async (req, res) => {
    res.setHeader('content-type', 'image/png');
    res.sendFile(directory+"/"+req.params.dataset_id+"/blob.square.png");
  });

  app.get('/api/v1/image/:dataset_id/:view', async (req, res) => {
    if (req.query.format == 'svg'){
      res.setHeader('content-type', 'image/svg+xml');
      let file = directory+"/"+req.params.dataset_id+"/"+req.params.view+".svg"
      res.sendFile(file);
    }
    else {
      res.setHeader('content-type', 'image/png');
      let file = directory+"/"+req.params.dataset_id+"/"+req.params.view+".png"
      if (req.query.width){
        let outputBuffer = await resize(file, Math.floor(1*req.query.width))
        res.send(outputBuffer)
      }
      else {
        res.sendFile(file);
      }
    }
  });

  app.get('/api/v1/image/:dataset_id/:view/:type', async (req, res) => {
    if (req.query.format == 'svg'){
      res.setHeader('content-type', 'image/svg+xml');
      let file = directory+"/"+req.params.dataset_id+"/"+req.params.view+"."+req.params.type+".svg"
      res.sendFile(file);
    }
    else {
      res.setHeader('content-type', 'image/png');
      let file = directory+"/"+req.params.dataset_id+"/"+req.params.view+"."+req.params.type+".png"
      if (req.query.width){
        let outputBuffer = await resize(file, Math.floor(1*req.query.width))
        res.send(outputBuffer)
      }
      else {
        res.sendFile(file);
      }
    }

  });
};
