import React from 'react'
import { connect } from 'react-redux'
import { getRepositoryIsFetching,
  getAvailableDatasetIds,
  fetchMeta,
  loadDataset,
  setDatasetIsActive } from '../reducers/repository'
import { getDatasetID,
  updatePathname } from '../reducers/location'
import styles from './Layout.scss'
import MenuDataset from './MenuDataset'
import Spinner from './Spinner'
import ToolTips from './ToolTips'
import Search from './Search'

const DatasetMenu = ({ selectedDataset, isFetching, datasetIds, onDatasetMount, onDatasetClick }) => {
  return (
    <div className={styles.fill_parent}>
      <Search/>
      {isFetching ? <Spinner /> : null}
      {datasetIds.map(id => {
        let active = false
        if (id == selectedDataset) active = true
        return (
          <MenuDataset
            key={id}
            id={id}
            active={active}
            onDatasetMount={(id) => onDatasetMount(id)}
            onDatasetClick={(id) => onDatasetClick(id)}
          />
        )}
      )}
      <ToolTips set='datasetMenu'/>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    isFetching: getRepositoryIsFetching(state),
    datasetIds: getAvailableDatasetIds(state),
    selectedDataset: getDatasetID(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // onDatasetClick: id => dispatch(loadDataset(id,true)),
    onDatasetClick: id => {
      dispatch(setDatasetIsActive(false))
      dispatch(updatePathname({dataset:id}))
    },
    onDatasetMount: id => dispatch(fetchMeta(id))
  }
}
const MenuDatasetMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(DatasetMenu)

export default MenuDatasetMenu
