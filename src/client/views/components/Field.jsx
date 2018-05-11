import React from 'react'
import styles from './Fields.scss';
import FieldBox from './FieldBox'
import { connect } from 'react-redux'
import { getMainPlot } from '../reducers/plot'
import { makeGetFieldMetadata,
  getDetailsForFieldId,
  editField,
  cloneField,
  fetchRawData } from '../reducers/field'
import { filterToList, editFilter } from '../reducers/filter'
import { editPlot } from '../reducers/plot'
import { getSelectionDisplay,
  toggleSelection,
  selectAll,
  selectNone,
  invertSelection } from '../reducers/select'
import { withRouter } from 'react-router-dom'
import { addQueryValues } from '../reducers/history'

class Field extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => {
        let obj = Object.assign({},getDetailsForFieldId(state, props.fieldId))
        obj.plot = getMainPlot(state)
        obj.hideSelection = !getSelectionDisplay(state)
        return obj
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
        setAxes: (axis,id) => {
          addQueryValues({[axis+'Field']:id})
          dispatch(editPlot({id:'default',[axis]:id}))
        },
        cloneField: (id) => {dispatch(cloneField({id}))},
        showData: (id) => dispatch(fetchRawData(id)),
        toggleSelection: (visible) => dispatch(toggleSelection(visible)),
        selectAll: () => dispatch(selectAll()),
        selectNone: () => dispatch(selectNone()),
        invertSelection: () => dispatch(invertSelection())
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
