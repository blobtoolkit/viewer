module.exports = function(app, db) {
  var directory = app.locals.directory;
  app.get('/api/:dataset_id/preview/:variable_id', function(req, res) {
    var js = require(directory+'/'+req.params.dataset_id+'/'+req.params.variable_id+'.json');
    res.send(JSON.stringify(js[2]))
  });
};
