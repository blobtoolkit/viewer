import React from 'react'
import styles from './Fields.scss';
import FieldBox from './FieldBox'
import { connect } from 'react-redux'
import { makeGetFieldMetadata } from '../reducers/field'


class Field extends React.Component {
  constructor(props) {
    super(props);
    this.makeMapStateToProps = () => {
      const getFieldMetadata = makeGetFieldMetadata()
      return (state, props) => {
        return getFieldMetadata(state, props.fieldId)
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
      }
    }
  }

  render(){
    const ConnectedField = connect(
      this.makeMapStateToProps,
      this.mapDispatchToProps
    )(FieldBox)
    return <ConnectedField {...this.props}/>
  }
}

export default Field
