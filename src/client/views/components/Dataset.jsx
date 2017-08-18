import React from 'react'
import {AvailableFiltersBox} from './Filters';

const FILTERS = [
  {id:'gc',name:'gc',description:'contig-wide GC proportion',active:false,inclusive:true,limits:[0.05,0.85]},
  {id:'length',name:'length',description:'contig length (bp)',active:false,inclusive:true,limits:[200,676517]},
  {id:'velvet_cov',name:'velvet_cov',description:'coverage',active:false,inclusive:true,limits:[1,15650]}
]

class Dataset extends React.Component {
  render() {
    return (
      <div>
        <h1>BlobToolKit React Website!</h1>
        <a>{this.props.datasetId}</a>
        <AvailableFiltersBox filters={FILTERS}/>
      </div>
    )
  }
}

export default Dataset;

export {
  Dataset
}
