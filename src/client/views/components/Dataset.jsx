import React from 'react'
import {AvailableFieldsBox, FieldBox} from './Fields';
import DatasetModel from '../../models/dataset';
import utils from '../../../shared/functions/utils';

class Dataset extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      fields: [],
      dataset: new DatasetModel(this.props.match.params.datasetId)
    };
    this.toggleActive = this.toggleActive.bind(this);
    this.functions = {
      toggleActive: this.toggleActive
    }
  }

  componentDidMount() {
    this.state.dataset.loadMeta(
      (error) => { console.log(error) },
      (ds) => { this.setState({loading:false, fields:utils.objectToArray(ds.fields)}); }
    );
  }

  toggleActive(e) {
    let id = e.target.getAttribute('rel');
    let fields = this.state.dataset.fields;
    if (fields[id]){
      fields[id]._active = !fields[id]._active;
      this.setState({fields:fields});
    }
  }

  renderFields(hierarchy = this.state.dataset.hierarchy, key = 'Fields'){
    if (this.state.loading == true){
      return <LoadingDataset />
    }
    else {
      let children = [];
      let fields = this.state.dataset.fields;
      let expand = true;
      Object.keys(hierarchy).forEach((key) => {
        if (fields[key]){
          children.push(this.renderField(fields[key],hierarchy[key]));
          //if (fields[key]._active){
          //  expand = true;
          //}
        }
        if (Object.keys(hierarchy[key]).length > 0) {
          children.push(this.renderFields(hierarchy[key],key));
        }
      })
      return (
        <AvailableFieldsBox key={key} title={key} children={children} expand={expand} />
      )
    }
  }

  renderField(field,hierarchy){
    if (field._type == 'variable'){
      return <FieldBox key={field._id} datasetId={this.props.match.params.datasetId} filter={field.filters['default']} functions={this.functions}/>
    }
  }

  render() {
    return (
      <div>
        <h1>BlobToolKit React Website!</h1>
        {this.renderFields()}
      </div>
    )
  }
}

class LoadingDataset extends React.Component {
  render() {
    return (
      <span>Loading dataset</span>
    )
  }
}

export default Dataset;

export {
  Dataset
}
