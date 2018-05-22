import React from 'react'
import { connect } from 'react-redux'
import { getRepositoryIsFetching, getAvailableDatasetIds, fetchMeta, loadDataset } from '../reducers/repository'
import { getSelectedDataset } from '../reducers/dataset'
import styles from './Layout.scss'
import MenuDataset from './MenuDataset'
import Spinner from './Spinner'
import { clearQuery } from '../reducers/history'

const DatasetMenu = ({ selectedDataset, isFetching, datasetIds, onDatasetMount, onDatasetClick }) => {
  return (
    <div className={styles.menu}>
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
    </div>
  )
}

const mapStateToProps = state => {
  return {
    isFetching: getRepositoryIsFetching(state),
    datasetIds: getAvailableDatasetIds(state),
    selectedDataset: getSelectedDataset(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onDatasetClick: id => {clearQuery(); return dispatch(loadDataset(id))},
    onDatasetMount: id => dispatch(fetchMeta(id))
  }
}
const MenuDatasetMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(DatasetMenu)

export default MenuDatasetMenu
