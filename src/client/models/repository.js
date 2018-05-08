import Repository from '../../shared/models/repository';
import config from '../../config/client';
import { json as d3json } from 'd3-json';

export default Repository;

Repository.prototype.url = () => {
  this.url = this.url || config.apiUrl+'/dataset/all';
  return this.url;
}

Repository.prototype.loadMeta = (error,callback) => {
  let url = config.apiUrl+'/dataset/all';
  d3json(url,(err,data)=>{
    if (err){
      error(err);
    }
    else {
      callback(data);
    }
  });
}
