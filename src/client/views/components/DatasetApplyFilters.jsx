import React from 'react'
import { connect } from 'react-redux'
import {
  filterToList
} from '../reducers/repository'
import Spinner from './Spinner'


const mapStateToProps = state => {
  return {

  }
}

const mapDispatchToProps = dispatch => {
  return {
    onClick: () => dispatch(filterToList())
  }
}

class ApplyFilters extends React.Component {

  render(){

    return (
      <div onClick={this.props.onClick}>
        Apply
      </div>
    )
  }
}

const DatasetApplyFilters = connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplyFilters)

export default DatasetApplyFilters
