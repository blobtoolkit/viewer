import React from 'react'
import { connect } from 'react-redux'
import { getRepositoryIsFetching,
  getAvailableDatasetIds,
  fetchMeta,
  setDatasetIsActive,refreshStore } from '../reducers/repository'
import { getDatasetID,
  updatePathname,
  getSearchTerm } from '../reducers/location'
import styles from './Layout.scss'
import MenuDataset from './MenuDataset'
import MenuSwitchView from './MenuSwitchView'
import Spinner from './Spinner'
import ToolTips from './ToolTips'
import Search from './Search'

const DatasetMenu = ({ searchTerm, selectedDataset, isFetching, datasetIds, onDatasetMount, onDatasetClick }) => {
  return (
    <div className={styles.menu_outer}>
      <MenuSwitchView/>
      <Search/>
      {isFetching ? <Spinner /> : null}
      { datasetIds.length > 0 ? (
        <span className={styles.result_count} style={{marginLeft:'1em'}} key='span'>{datasetIds.length+' datasets match "'+searchTerm+'"'}</span>
      ) : null }
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
const MenuDatasetMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(DatasetMenu)

export default MenuDatasetMenu
