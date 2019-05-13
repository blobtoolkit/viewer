import React from 'react'
import { connect } from 'react-redux'
import { getRepositoryIsFetching,
  getAvailableDatasetIds,
  getAvailableDatasets,
  fetchMeta,
  setDatasetIsActive,refreshStore } from '../reducers/repository'
import { getDatasetID,
  updatePathname,
  getSearchTerm } from '../reducers/location'
import styles from './Layout.scss'
import MenuDataset from './MenuDataset'
import DatasetTable from './DatasetTable'
import Spinner from './Spinner'
import ToolTips from './ToolTips'
import Search from './Search'

const DatasetFinder = ({ searchTerm, selectedDataset, isFetching, datasetIds, datasets, onDatasetMount, onDatasetClick }) => {

  return (
    <div className={styles.fill_parent}>
      <Search/>
      {isFetching ? <Spinner /> : null}
      { datasetIds.length > 0 ? (
        <span className={styles.result_count} style={{marginLeft:'1em'}} key='span'>{datasetIds.length+' datasets match "'+searchTerm+'"'}</span>
      ) : null }
      <DatasetTable/>
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
    onDatasetClick: id => {
      dispatch(refreshStore())
      dispatch(setDatasetIsActive(false))
      dispatch(updatePathname({dataset:id}))
    },
    onDatasetMount: id => dispatch(fetchMeta(id))
  }
}
const FindDatasets = connect(
  mapStateToProps,
  mapDispatchToProps
)(DatasetFinder)

export default FindDatasets
