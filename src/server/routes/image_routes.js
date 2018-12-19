module.exports = function(app, db) {
  var directory = app.locals.directory;
  app.get('/api/v1/image/:dataset_id', async (req, res) => {
    res.setHeader('content-type', 'image/png');
    console.log(directory+"/"+req.params.dataset_id)
    res.sendFile(directory+"/"+req.params.dataset_id+"/blob.square.png");
  });

  app.get('/api/v1/image/:dataset_id/:view', async (req, res) => {
    res.setHeader('content-type', 'image/png');
    console.log(directory+"/"+req.params.dataset_id+"/"+req.params.view+".png")
    res.sendFile(directory+"/"+req.params.dataset_id+"/"+req.params.view+".png");
  });

  app.get('/api/v1/image/:dataset_id/:view/:type', async (req, res) => {
    res.setHeader('content-type', 'image/png');
    res.sendFile(directory+"/"+req.params.dataset_id+"/"+req.params.view+"."+req.params.type+".png");
  });
};
