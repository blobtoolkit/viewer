import Field from "../../shared/models/field";
import config from "../../config/client";
import { json as d3json } from "d3-json";

const loadValues = (field, error, callback) => {
  let url = config.apiUrl + "/field/" + field.dataset.id + "/" + field._id;
  d3json(url, (err, data) => {
    if (err) {
      error(err);
      callback({ values: [], keys: [] });
    } else {
      field.values = data;
      callback(data);
    }
  });
};

export default loadValues;

export { loadValues };
