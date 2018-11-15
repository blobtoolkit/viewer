module.exports = function(app, db) {
  var directory = app.locals.directory;
  app.get('/api/v1/image/:dataset_id', async (req, res) => {
    res.setHeader('content-type', 'image/png');
    res.sendFile(directory+"/"+req.params.dataset_id+"/blob.png");
  });
};

module.exports = function(app, db) {
  var directory = app.locals.directory;
  app.get('/api/v1/image/:dataset_id/:view', async (req, res) => {
    res.setHeader('content-type', 'image/png');
    res.sendFile(directory+"/"+req.params.dataset_id+"/"+req.params.view+".png");
  });
};
