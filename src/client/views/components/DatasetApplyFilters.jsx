import React from 'react'
import { connect } from 'react-redux'
import {
  filterToList
} from '../reducers/filter'
import {
  getFilteredSummary
} from '../reducers/preview'
import Spinner from './Spinner'
import styles from './Datasets.scss'


const mapStateToProps = state => getFilteredSummary(state)

const mapDispatchToProps = dispatch => {
  return {
    onClick: () => dispatch(filterToList())
  }
}

class ApplyFilters extends React.Component {

  render(){
    return (
      <div className={styles.dataset_controls}>
        <div onClick={this.props.onClick}>
          Apply
        </div>
        <div>
          {this.props.selected}/{this.props.count} ({this.props.percentage}) {this.props.type} selected
        </div>
      </div>
    )
  }
}

const DatasetApplyFilters = connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplyFilters)

export default DatasetApplyFilters
