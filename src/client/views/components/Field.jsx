import React from 'react'
import styles from './Fields.scss';
import FieldBox from './FieldBox'
import { connect } from 'react-redux'
import { makeGetFieldMetadata,
  getDetailsForFieldId,
  editField,
  fetchRawData } from '../reducers/field'
import { filterToList } from '../reducers/filter'
import { editPlot } from '../reducers/plot'


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
        toggleActive: (obj) => {
          // if (this.props.fieldId.match(/bestsum/) && !this.props.fieldId.match(/score/) && !this.props.fieldId.match(/cindex/)){
          //   dispatch(editPlot({id:'default',cat:this.props.fieldId}))
          // }
          // else {
          //   dispatch(editPlot({id:'default',y:this.props.fieldId}))
          // }
          dispatch(editField(obj))
        },
        setAxes: (axis,id) => {console.log(axis);console.log(id);dispatch(editPlot({id:'default',[axis]:id}))},
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
