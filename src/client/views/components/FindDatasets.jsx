import React from 'react'
import { connect } from 'react-redux'
import { getRepositoryIsFetching,
  getAvailableDatasetIds,
  getAvailableDatasets,
  fetchMeta,
  setDatasetIsActive,refreshStore } from '../reducers/repository'
import { getDatasetID,
  updatePathname,
  getSearchTerm,
  toggleHash,
  removeHash,
  chooseView } from '../reducers/location'
import styles from './Layout.scss'
import MenuDataset from './MenuDataset'
import DatasetTable from './DatasetTable'
import DatasetTree from './DatasetTree'
import Spinner from './Spinner'
import ToolTips from './ToolTips'
import Search from './Search'

const dataset_table = DATASET_TABLE || false

const DatasetFinder = ({ searchTerm, selectedDataset, isFetching, datasetIds, datasets, onDatasetMount, onDatasetClick }) => {
  let css = dataset_table ? styles.fill_parent : ''
  return (
    <div className={css}>
      <Search/>
      {isFetching ? <Spinner /> : null}
      { datasetIds.length > 0 ? (
        <span className={styles.result_count} style={{marginLeft:'1em'}} key='span'>{datasetIds.length+' datasets match "'+searchTerm+'"'}</span>
      ) : null }
      {dataset_table && <DatasetTable onDatasetClick={onDatasetClick}/>}
      <DatasetTree/>
      
    </div>
  )
}

const mapStateToProps = state => {
  return {
    isFetching: getRepositoryIsFetching(state),
    datasetIds: getAvailableDatasetIds(state),
    selectedDataset: getDatasetID(state),
    searchTerm: getSearchTerm(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onDatasetClick: (id,view) => {
      dispatch(refreshStore())
      dispatch(setDatasetIsActive(false))
      if (view){
        dispatch(updatePathname({dataset:id,[view]:true}))
      }
      else {
        dispatch(updatePathname({dataset:id}))
      }
      dispatch(toggleHash('Filters'))
    },
    onDatasetMount: id => dispatch(fetchMeta(id))
  }
}
const FindDatasets = connect(
  mapStateToProps,
  mapDispatchToProps
)(DatasetFinder)

export default FindDatasets
