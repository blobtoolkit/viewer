import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styles from './Repository.scss';
import { Link } from 'react-router-dom'
import Spinner from './Spinner'


class AvailableDataset extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    this.props.onMount(this.props.id);
  }

  render(){
    const mapStateToProps = state => {
      return {
        meta: state.metadataByDataset[this.props.id] || {}
      }
    }
    const ConnectedDataset = connect(
      mapStateToProps,
      false
    )(Dataset)

    return (
      <Link to={'/view/'+this.props.id}>
        <div className={styles.dataset} onClick={()=>{this.props.onMount(this.props.id)}}>
          <ConnectedDataset/>
        </div>
      </Link>
    )
  }


}

class Dataset extends React.Component {
  render(){
    if (!this.props.meta.meta){
      return <Spinner/>
    }
    return (
      <div>
        {this.props.meta.meta.name}<br/>
        {this.props.meta.meta.records} {this.props.meta.meta.record_type}
      </div>
    )
  }
}

export default AvailableDataset
