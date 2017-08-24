import React from 'react'
import PropTypes from 'prop-types'
import styles from './Repository.scss';
import AvailableDataset from './AvailableDataset'
import Spinner from './Spinner'

const AvailableDatasetList = ({ isFetching, datasets, onDatasetMount }) => (
  <div>
    {isFetching ? <Spinner /> : null}
    {datasets.map(dataset => (
      <AvailableDataset key={dataset.id} id={dataset.id} onMount={(id) => onDatasetMount(id)} />
    ))}
  </div>
)

AvailableDatasetList.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  datasets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  ).isRequired
}

export default AvailableDatasetList
