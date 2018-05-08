import Dataset from '../../shared/models/dataset';
import config from '../../config/client';
import { json as d3json } from 'd3-json';

export default Dataset;

Dataset.prototype.loadMeta = function(error,callback) {
  if (!this.meta){
    let url = config.apiUrl+'/dataset/id/'+this.id;
    d3json(url,(err,data)=>{
      if (err){
        error(err);
      }
      else {
        this.name = data.name || this.id
        this.description = data.description || this.name
        this.records = data.records
        this.record_type = data.record_type
        this.addFields(data.fields);
        callback(this);
      }
    });
  }
  else {
    return this.meta;
  }
}
