import React from 'react'
import styles from './Filters.scss';
import FilterBox from './FilterBox'
import { connect } from 'react-redux'
import { getFilterMetadata } from '../reducers/repository'
import { editFilter } from '../reducers/repository'

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      let filterLimit = this.props.range
      let filterId = this.props.fieldId
      let xScale = this.props.xScale
      let meta = getFilterMetadata(state,filterId)
      let filterType = 'range'
      let filterRange = meta.range || [1,10];
      return {
        filterId,
        filterRange,
        filterLimit,
        filterType,
        xScale
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
        onUpdateRange: range => dispatch(editFilter({id:'length',range:range}))
      }
    }
  }

  render(){
    const ConnectedFilter = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(FilterBox)

    return <ConnectedFilter />
  }
}

export default Filter
