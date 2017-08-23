import React from 'react'
import PropTypes from 'prop-types'
import styles from './Repository.scss';
import { Link } from 'react-router-dom'

const AvailableDataset = ({ id, description }) => (
<Link to={'/view/'+id}>
  <div className={styles.dataset}>
    <div>{id}</div>
    <div>{description}</div>
  </div>
</Link>
)

AvailableDataset.propTypes = {
  id: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
}

export default AvailableDataset
