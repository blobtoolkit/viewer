import React from 'react'
import styles from './Fields.scss';
import FieldBox from './FieldBox'
import { connect } from 'react-redux'
import { makeGetFieldMetadata, getDetailsForFieldId } from '../reducers/field'
import { filterToList } from '../reducers/repository'


class Field extends React.Component {
  constructor(props) {
    super(props);
    // this.makeMapStateToProps = () => {
    //   const getFieldMetadata = makeGetFieldMetadata()
    //   return (state, props) => {
    //     return getFieldMetadata(state, props.fieldId)
    //   }
    // }
    this.mapStateToProps = () => {
      return (state, props) => {
        return getDetailsForFieldId(state, props.fieldId)
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
        applyFilter: () => dispatch(filterToList())
      }
    }
  }

  render(){
    const ConnectedField = connect(
      //this.makeMapStateToProps,
      this.mapStateToProps,
      this.mapDispatchToProps
    )(FieldBox)
    return <ConnectedField {...this.props}/>
  }
}

export default Field
