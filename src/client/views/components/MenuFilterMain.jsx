import React from 'react'
import { connect } from 'react-redux'
import styles from './Layout.scss'
import { getDatasetIsFetching,getDatasetIsActive } from '../reducers/repository'
import {
  getTopLevelFields,
  getFieldHierarchy,
  getFieldsByParent
} from '../reducers/field'
import Spinner from './Spinner'
import DatasetApplyFilters from './DatasetApplyFilters'
import DatasetCreateList from './DatasetCreateList'
import Field from './Field'
import FieldSet from './FieldSet'
import MainPlot from './MainPlot'
import ToolTips from './ToolTips'


class FieldMenu extends React.Component {
  mapFields(fields){
    return (
      fields.map((field,i) => {
        let jsx
        if (field.hasRecords){
          jsx = <Field key={i} fieldId={field.id}>{field.id}</Field>
        }
        else if (field.id == 'selection'){
          /*
            TODO:
            Selection Filter goes here
          */
          jsx = <Field key={i} fieldId={field.id}>{field.id}</Field>
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
    // console.log(this.props)
    if (!this.props.isActive){
      return (
        <div className={styles.fill_parent}>
          Select a dataset to begin.
        </div>
      )
    }
    let fields = this.mapFields(this.props.fields)
    return (
      <div className={styles.fill_parent}>
        <div className={styles.sticky}>
          <DatasetApplyFilters />
        </div>
        {fields}
        <ToolTips set='filterMenu'/>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    isActive: getDatasetIsActive(state),
    topLevelFields: getTopLevelFields(state),
    fields: getFieldHierarchy(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onDatasetClick: id => dispatch(selectDataset(id)),
    onDatasetMount: id => dispatch(fetchMeta(id))
  }
}

const MenuFilterMain = connect(
  mapStateToProps
)(FieldMenu)

export default MenuFilterMain
