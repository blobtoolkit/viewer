import React from 'react'
import styles from './Filters.scss';
import FilterBox from './FilterBox'
import { connect } from 'react-redux'
import { makeGetFilterMetadata } from '../reducers/repository'
import { editFilter } from '../reducers/repository'

class Filter extends React.Component {
  constructor(props) {
    super(props);

    this.makeMapStateToProps = () => {
      const getFilterMetadata = makeGetFilterMetadata()
      return (state, props) => {
        let meta = getFilterMetadata(state, props)
        return {
          filterLimit: this.props.range,
          filterId: this.props.fieldId,
          xScale: this.props.xScale,
          filterType: 'range',
          filterRange: meta.range || [1,10]
        }
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
