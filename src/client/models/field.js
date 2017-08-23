import Field from '../../shared/models/field';
import config from '../../config/client';
import * as d3 from 'd3';

const loadValues = (field, error, callback) => {
  let url = config.apiUrl+'/field/'+field.dataset.id+'/'+field._id;
  d3.json(url,(err,data)=>{
    if (err){
      error(err);
    }
    else {
      field.values = data;
      callback(data);
    }
  });
}

export default loadValues

export {
  loadValues
}
