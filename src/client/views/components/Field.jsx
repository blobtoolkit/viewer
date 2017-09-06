import React from 'react'
import styles from './Fields.scss';
import FieldBox from './FieldBox'
import { connect } from 'react-redux'
import { makeGetFieldMetadata,
  getDetailsForFieldId,
  editField,
  fetchRawData } from '../reducers/field'
import { filterToList } from '../reducers/filter'


class Field extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => {
        return getDetailsForFieldId(state, props.fieldId)
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
        applyFilter: () => dispatch(filterToList()),
        toggleActive: (obj) => dispatch(editField(obj)),
        showData: (id) => dispatch(fetchRawData(id))
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
