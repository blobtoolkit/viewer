import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Datasets.scss';
import config from '../../../config/client';

class AvailableDatasetsBox extends React.Component {
  render() {
    var children = [];
    this.props.datasets.forEach((dataset) => {
      children.push(<DatasetBox dataset={dataset} key={dataset.id} />)
    });
    var loading = <LoadingDatasets />
    return (
      <div>
        {this.props.loading ? loading : children}
      </div>
    )
  }
}

class LoadingDatasets extends React.Component {
  render() {
    return (
      <span>loading available datasets</span>
    )
  }
}

class DatasetBox extends React.Component {
  render() {
    return (
      <div id={this.props.dataset.id} className={styles.outer}>
        <Link to={'/view/'+this.props.dataset.id}>{this.props.dataset.name}</Link>
      </div>
    )
  }
}



export default AvailableDatasetsBox;

export {
  AvailableDatasetsBox
}
