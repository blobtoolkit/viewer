import React from 'react'
import { connect } from 'react-redux'
import {
  getDatasetIsFetching,
  loadDataset
} from '../reducers/repository'
import {
  getTopLevelFields,
  getFieldHierarchy,
  getFieldsByParent
} from '../reducers/field'
import Spinner from './Spinner'
import DatasetApplyFilters from './DatasetApplyFilters'
import Field from './Field'
import FieldSet from './FieldSet'


const mapStateToProps = state => {
  return {
    isFetching: getDatasetIsFetching(state),
    topLevelFields: getTopLevelFields(state),
    fields: getFieldHierarchy(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onDatasetClick: id => {},//},
    onMount: id => dispatch(loadDataset(id))
  }
}

class Overview extends React.Component {

  componentDidMount(){
    this.props.onMount(this.props.match.params.datasetId)
  }

  mapFields(fields){
    return (
      fields.map(field => {
        console.log(field.id)
        let jsx
        if (field.hasRecords){
          jsx = <Field key={field.id} fieldId={field.id}>{field.id}</Field>
        }
        if (field.children){
          return (
            <FieldSet
              key={field.id+'_children'}
              title={field.id}>
              {jsx}
              {this.mapFields(field.children)}
            </FieldSet>
          )
        }
        else {
          return jsx
        }
      })
    )
  }

  render(){
    if (this.props.isFetching){
      return <Spinner/>
    }
    let fields = this.mapFields(this.props.fields)
    return (
      <div>
        <DatasetApplyFilters />
        {fields}
      </div>
    )
  }
}

const Dataset = connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview)

export default Dataset
