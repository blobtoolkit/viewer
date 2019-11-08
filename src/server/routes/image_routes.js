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

/**
 * @swagger
 * parameter:
 *   view:
 *     in: path
 *     name: view
 *     type: string
 *     enum:
 *       - blob
 *       - cumulative
 *       - kite
 *       - snail
 *     required: true
 *     description: view type
 */
/**
   * @swagger
   * parameter:
   *   type:
   *     in: path
   *     name: type
   *     type: string
   *     enum:
   *       - square
   *       - hex
   *       - circle
   *     required: true
   *     description: blob view plot type
   */
 /**
  * @swagger
  * parameter:
  *   format:
  *     in: query
  *     name: format
  *     type: string
  *     enum:
  *       - png
  *       - svg
  *     required: false
  *     description: image format
  *     default: png
  */
/**
 * @swagger
 * parameter:
 *   width:
 *     in: query
 *     name: width
 *     type: integer
 *     required: false
 *     description: png image width
 *     default: 2000
 */


module.exports = function(app, db) {
  var directory = app.locals.directory;

  /**
   * @swagger
   * /api/v1/image/{dataset_id}:
   *   get:
   *     tags:
   *       - Images
   *     description: Returns an image of a dataset view
   *     produces:
   *       - image/png
   *       - image/svg+xml
   *     responses:
   *       200:
   *         description: OK
   *     parameters:
   *       - $ref: "#/parameters/dataset_id"
   */
  app.get('/api/v1/image/:dataset_id', async (req, res) => {
    res.setHeader('content-type', 'image/png');
    res.sendFile(directory+"/"+req.params.dataset_id+"/blob.square.png");
  });

  /**
   * @swagger
   * /api/v1/image/{dataset_id}/{view}:
   *   get:
   *     tags:
   *       - Images
   *     description: Returns an image of a dataset view
   *     produces:
   *       - image/png
   *       - image/svg+xml
   *     responses:
   *       200:
   *         description: OK
   *     parameters:
   *       - $ref: "#/parameters/dataset_id"
   *       - $ref: "#/parameters/view"
   *       - $ref: "#/parameters/format"
   *       - $ref: "#/parameters/width"
   */
  app.get('/api/v1/image/:dataset_id/:view', async (req, res) => {
    let type = ''
    if (req.params.view == 'blob'){
      type = '.square'
    }
    if (req.query.format == 'svg'){
      res.setHeader('content-type', 'image/svg+xml');
      let file = directory+"/"+req.params.dataset_id+"/"+req.params.view+type+".svg"
      res.sendFile(file);
    }
    else {
      res.setHeader('content-type', 'image/png');
      let file = directory+"/"+req.params.dataset_id+"/"+req.params.view+type+".png"
      if (req.query.width){
        let outputBuffer = await resize(file, Math.floor(1*req.query.width))
        res.send(outputBuffer)
      }
      else {
        res.sendFile(file);
      }
    }
  });

  /**
   * @swagger
   * /api/v1/image/{dataset_id}/blob/{type}:
   *   get:
   *     tags:
   *       - Images
   *     description: Returns an image of a blob view plot type
   *     produces:
   *       - image/png
   *       - image/svg+xml
   *     responses:
   *       200:
   *         description: OK
   *     parameters:
   *       - $ref: "#/parameters/dataset_id"
   *       - $ref: "#/parameters/type"
   *       - $ref: "#/parameters/format"
   *       - $ref: "#/parameters/width"
   */
  app.get('/api/v1/image/:dataset_id/blob/:type', async (req, res) => {
    if (req.query.format == 'svg'){
      res.setHeader('content-type', 'image/svg+xml');
      let file = directory+"/"+req.params.dataset_id+"/blob."+req.params.type+".svg"
      res.sendFile(file);
    }
    else {
      res.setHeader('content-type', 'image/png');
      let file = directory+"/"+req.params.dataset_id+"/blob."+req.params.type+".png"
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
