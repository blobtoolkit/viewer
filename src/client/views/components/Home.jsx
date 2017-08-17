import React from 'react'
import {AvailableFiltersBox} from './Filters';

const FILTERS = [
  {id:'gc',name:'gc',description:'contig-wide GC proportion',active:false,inclusive:true},
  {id:'length',name:'length',description:'contig length (bp)',active:false,inclusive:true},
  {id:'cov1',name:'cov1',description:'coverage',active:false,inclusive:true}
]

const Home = () => (
  <div>
    <h1>BlobToolKit React Website!</h1>
    <AvailableFiltersBox filters={FILTERS}/>
  </div>
)

module.exports = Home;
