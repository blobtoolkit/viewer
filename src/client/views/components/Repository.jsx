import React from 'react'
import PropTypes from 'prop-types'


import {AvailableDatasetsBox} from './Datasets';
import RepositoryModel from '../../models/repository';
import * as d3 from 'd3';
const myRepository = new RepositoryModel('default')

class Repository extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      datasets: []
    };
  }

  componentDidMount() {
    myRepository.loadMeta(
      (error) => { console.log(error) },
      (data) => { this.setState({loading:false, datasets:data}) }
    );
  }

  render(){
    return (
      <AvailableDatasetsBox loading={this.state.loading} datasets={this.state.datasets}/>
    )
  }

}

export default Repository;
