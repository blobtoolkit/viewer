import React from 'react'
import styles from './Filters.scss';
import FilterBox from './FilterBox'
import { connect } from 'react-redux'
import {
  getDetailsForFilterId,
  editFilter } from '../reducers/filter'

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => {
        return getDetailsForFilterId(state, props.filterId)
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
        onUpdateRange: (id,range) => {return dispatch(editFilter({id:id,range:range}))}
      }
    }
  }

  render(){
    const ConnectedFilter = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(FilterBox)
    return (
      <ConnectedFilter filterId={this.props.fieldId} {...this.props}/>
    )
  }
}

export default Filter
