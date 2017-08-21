import React from 'react'
import {AvailableFiltersBox} from './Filters';
import DatasetModel from '../../models/dataset';
import utils from '../../../shared/functions/utils';
//const myDataset = new DatasetModel('ds2')

const FIELDS = [
//  {id:'gc',name:'gc',description:'contig-wide GC proportion',active:false,inclusive:true,limits:[0.05,0.85]},
//  {id:'length',name:'length',description:'contig length (bp)',active:false,inclusive:true,limits:[200,676517]},
//  {id:'velvet_cov',name:'velvet_cov',description:'coverage',active:false,inclusive:true,limits:[1,15650]}
]

class Dataset extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      fields: FIELDS,
      dataset: new DatasetModel(this.props.match.params.datasetId)
    };
  }

  componentDidMount() {
    this.state.dataset.loadMeta(
      (error) => { console.log(error) },
      (ds) => { this.setState({loading:false, fields:utils.objectToArray(ds.fields)}); }
    );
  }

  render() {
    let content;
    if (this.state.loading == true){
      content = <LoadingDataset />
    }
    else {
      content = <AvailableFiltersBox datasetId={this.props.match.params.datasetId} fields={this.state.fields}/>
    }
    return (
      <div>
        <h1>BlobToolKit React Website!</h1>
        {content}
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
