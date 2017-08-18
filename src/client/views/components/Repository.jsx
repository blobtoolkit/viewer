import React from 'react'
import {AvailableDatasetsBox} from './Datasets';

const DATASETS = [
  {
    "name": "Example dataset",
    "id": "ds1",
    "description":"an example dataset"
  },
  {
    "name":"Sample dataset",
    "id":"ds2",
    "description":"another example of a dataset"
  }
]

const Repository = () => (
  <AvailableDatasetsBox datasets={DATASETS}/>
)

module.exports = Repository;
