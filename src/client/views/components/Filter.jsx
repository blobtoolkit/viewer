import React from 'react'
import styles from './Filters.scss';
import FilterBox from './FilterBox'
import { connect } from 'react-redux'
import {
  makeGetFilterMetadata,
  editFilter } from '../reducers/filter'

class Filter extends React.Component {
  constructor(props) {
    super(props);

    this.makeMapStateToProps = () => {
      const getFilterMetadata = makeGetFilterMetadata()
      return (state, props) => {
        let ret = getFilterMetadata(state, props.filterId)
        console.log(ret)
        return ret
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
        onUpdateRange: (id,range) => dispatch(editFilter({id:id,range:range}))
      }
    }
  }

  render(){
    const ConnectedFilter = connect(
      this.makeMapStateToProps,
      this.mapDispatchToProps
    )(FilterBox)

    return (
      <ConnectedFilter filterId={this.props.fieldId}/>
    )
  }
}

export default Filter
