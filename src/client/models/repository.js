import Repository from '../../shared/models/repository';
import config from '../../config/client';
import * as d3 from 'd3';

export default Repository;

Repository.prototype.url = () => {
  this.url = this.url || config.apiUrl+'/dataset/all';
  return this.url;
}

Repository.prototype.loadMeta = (error,callback) => {
  let url = config.apiUrl+'/dataset/all';
  d3.json(url,(err,data)=>{
    if (err){
      error(err);
    }
    else {
      callback(data);
    }
  });
}
