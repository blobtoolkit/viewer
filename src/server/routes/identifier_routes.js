module.exports = function(app, db) {
  var directory = app.locals.directory;
  app.get('/api/:dataset_id/identifier/:identifier_id', function(req, res) {
    res.sendFile(directory+"/"+req.params.dataset_id+"/"+req.params.identifier_id+".json");
  });
  app.get('/api/:dataset_id/identifier/:identifier_id/:index', function(req, res) {
    var js = require(directory+'/'+req.params.dataset_id+'/'+req.params.identifier_id+'.json');
    res.send(JSON.stringify(js[req.params.index]))
  });
};
