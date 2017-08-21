import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Datasets.scss';
import config from '../../../config/client';
import DatasetModel from '../../models/dataset';

class AvailableDatasetsBox extends React.Component {
  render() {
    var children = [];
    this.props.datasets.forEach((dataset) => {
      children.push(<DatasetBox dataset={dataset} key={dataset.id} meta={dataset} />)
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
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      meta: props.meta
    };
  }
  componentDidMount() {
    let ds = new DatasetModel(this.props.dataset.id);
    ds.loadMeta(
      (error) => { console.log(error) },
      (data) => {
        this.setState({loading:false, meta:ds});
      }
    );
  }
  render() {
    let records;
    if (this.state.meta.records){
      records = <div>{this.state.meta.records + ' ' + this.state.meta.record_type}</div>;
    }
    return (
      <div id={this.state.meta.id} className={styles.outer}>
        <Link to={'/view/'+this.state.meta.id}>{this.state.meta.name}</Link>
        {records}
      </div>
    )
  }
}



export default AvailableDatasetsBox;

export {
  AvailableDatasetsBox
}
