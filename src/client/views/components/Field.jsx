import React from 'react'
import styles from './Fields.scss';
import FieldBox from './FieldBox'
import { connect } from 'react-redux'
import { getFieldMetadata } from '../reducers/repository'
import * as d3 from 'd3'


class Field extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      let meta = getFieldMetadata(state,this.props.fieldId)
      let range = meta.range || [1,10];
      let xScale = d3[meta.scale || 'scaleOrdinal']()
      xScale.domain(range)
      xScale.range([0,400])
      return {
        meta,
        xScale,
        range
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
      }
    }
  }

  render(){
    const ConnectedField = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(FieldBox)
    return <ConnectedField {...this.props}/>
  }
}

export default Field
