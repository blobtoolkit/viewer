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
import { editFilter, filterToList } from '../reducers/filter'
import { editPlot } from '../reducers/plot'
import { getSelectionDisplay,
  selectNone,
  toggleSelection } from '../reducers/select'
import { selectAll,
  invertSelection } from '../reducers/selectTools'
import { addQueryValues } from '../reducers/history'
import { queryToStore } from '../querySync'

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
          if (obj.active){
            dispatch(queryToStore({
              values:{[obj.id+'--Active']:obj.active},
              action:'FILTER'
            }))
          }
          else {
            dispatch(queryToStore({remove:[obj.id+'--Active'],action:'FILTER'}))
          }
          dispatch(editField(obj))
        },
        setAxes: (axis,id) => {
          // addQueryValues({[axis+'Field']:id})
          let values = {[axis+'Field']:id}
          dispatch(queryToStore({values}))
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
