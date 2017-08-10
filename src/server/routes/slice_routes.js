module.exports = function(app, db) {
  var directory = app.locals.directory;

  function values (ret,meta,path,index) {
    meta.forEach(function(n){
      var obj = {};
      if (n.children){
        obj[n.id] = []
        ret.push(obj);
        values(obj[n.id],n.children,path,index);
      }
      else {
        var js = require(path+n.id+'.json');
        obj[n.id] = js[index]
        ret.push(obj)
      }
    });
  }

  function slice (index,types,meta,path){
    var obj = {'index':index};
    types.forEach(function(t){
      obj[t] = [];
      values(obj[t],meta[t],path,index);
    });
    return obj;
  }

  app.get('/api/:dataset_id/slice/:index', function(req, res) {
    // index can be single value, comma separated, or range
    // open-ended ranges will be expanded to end of dataset
    var path = directory+'/'+req.params.dataset_id+'/';
    var meta = require(path+'meta.json');
    var index = req.params.index;
    var types = ['variable'];//,'category','label'];
    var ret = [];
    index.split(',').forEach(function(r){
      range = r.split('-');
      range[0] = range[0] ? range[0]*1 : 0;
      range[1] = range[1] ? range[1]*1 : r.match('-') ? meta.records-1 : range[0];
      // TODO: replace with pagination
      if (ret.length + range[1] - range[0] > 1000) res.send(JSON.stringify('range to large'))
      for (var i = range[0]; i <= range[1]; i++){
        ret.push(slice(i,types,meta,path));
      }
    })
    res.send(JSON.stringify(ret))
  });
};
