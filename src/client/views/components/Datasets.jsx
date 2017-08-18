import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Datasets.scss';

class AvailableDatasetsBox extends React.Component {
  render() {
    var children = [];
    console.log(this);
    this.props.datasets.forEach((dataset) => {
      children.push(<DatasetBox dataset={dataset} key={dataset.id} />)
    });
    return (
      <div>
        {children}
      </div>
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
