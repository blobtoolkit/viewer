import React from 'react'
import { connect } from 'react-redux'
import {
  getDatasetIsFetching,
  loadDataset
} from '../reducers/repository'
import {
  getTopLevelFields,
  getFieldsByParent
} from '../reducers/field'
import Spinner from './Spinner'
import Field from './Field'


const mapStateToProps = state => {
  return {
    isFetching: getDatasetIsFetching(state),
    topLevelFields: getTopLevelFields(state)
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
  render(){

    if (this.props.isFetching){
      return <Spinner/>
    }
    let fields = this.props.topLevelFields.map(id => <Field key={id} fieldId={id}>{id}</Field>)
    return (
      <div>
        Content
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
