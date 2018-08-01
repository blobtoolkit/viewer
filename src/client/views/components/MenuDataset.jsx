import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styles from './Layout.scss';
import { Link } from 'react-router-dom'
import Spinner from './Spinner'
import { createSelector } from 'reselect'
import { getDatasetMeta, loadDataset } from '../reducers/repository'
import { DatasetModal } from './DatasetModal'

const basename = BASENAME || ''

class MenuDataset extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => (
      {
        meta: getDatasetMeta(state,this.props.id)
      }
    )
    this.mapDispatchToProps = dispatch => (
      {
        onDatasetClick: id => dispatch(loadDataset(id))
      }
    )
  }

  componentDidMount(){
    this.props.onDatasetMount(this.props.id);
  }

  render(){
    const ConnectedDataset = connect(
      this.mapStateToProps,
      false
    )(Dataset)
    return (
      <ConnectedDataset {...this.props}/>
    )
  }
}

class Dataset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {show:false}
  }
  render(){
    if (!this.props.meta){
      return <Spinner/>
    }
    let css = styles.menu_item
    if (this.props.active) css += ' '+styles.active
    let records = this.props.meta.records || ''
    let record_type = this.props.meta.record_type || ''
    let taxon = this.props.meta.taxon || {}
    taxon = taxon.name || ''
    let accession = this.props.meta.accession || ''
    return (
      <div className={css}>
        <div data-tip data-for='view-metadata' className={styles.right} onClick={()=>this.setState({show:true})}>
          details
          <DatasetModal meta={this.props.meta} selected={this.state.show} dismiss={()=>this.setState({show:false})}/>
        </div>
        <a data-tip data-for='load-dataset' className={styles.most} onClick={()=>this.props.onDatasetClick(this.props.id)}>
          <h3>{this.props.meta.name}</h3>
          <span className={styles.menu_subtitle}>{accession}<br/><em>{taxon}</em></span>
        </a>
        <span className={styles.menu_count}>{records + ' ' + record_type}</span>
      </div>

    )
  }
}

export default MenuDataset
