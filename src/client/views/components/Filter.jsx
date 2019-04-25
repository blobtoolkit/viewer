import React from 'react'
import styles from './Filters.scss';
import FilterBox from './FilterBox'
import { connect } from 'react-redux'
import { editFilter } from '../reducers/filter'
import { getDetailsForFilterId } from '../reducers/preview'
import { queryToStore } from '../querySync'
import { getDatasetID } from '../reducers/location'

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => {
        let details = getDetailsForFilterId(state, props.filterId)
        details.datasetId = getDatasetID(state)
        // return Object.assign({details}, ...{datasetId})
        return details
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
        onUpdateRange: (id,range,index) => {
          let values = {}
          let remove = []
          if (index == 1){
            values[id+'--Min'] = range[0]
          }
          else if (index == 2){
            values[id+'--Max'] = range[1]
          }
          else if (index == -2) {
            remove.push(id+'--Max')
          }
          else if (index == -1) {
            remove.push(id+'--Min')
          }
          dispatch(queryToStore({values,remove,action:'FILTER'}))
        },
        onUpdateClamp: (id,value) => {
          let values = {}
          let remove = []
          values[id+'--Clamp'] = value
          dispatch(queryToStore({values,remove,action:'FIELD'}))
        }
      }
    }
  }

  render(){
    const ConnectedFilter = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(FilterBox)
    return (
      <ConnectedFilter filterId={this.props.fieldId} {...this.props}/>
    )
  }
}

export default Filter
