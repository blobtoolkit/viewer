module.exports = function(app, db) {
  var directory = app.locals.directory;
  app.get('/api/v1/identifiers/:dataset_id', async (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.sendFile(directory+"/"+req.params.dataset_id+"/identifiers.json");
  });
};
