import Field from '../../shared/models/field';
import config from '../../config/client';
import * as d3 from 'd3';

export default Field;

Field.prototype.loadValues = (error,callback) => {
  let url = config.apiUrl+'/field/'+this.dataset.id+'/'+this.id;
  d3.json(url,(err,data)=>{
    if (err){
      error(err);
    }
    else {
      callback(data);
    }
  });
}
