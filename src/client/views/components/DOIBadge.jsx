import React from 'react';
import styles from './Layout.scss'

const DOIBadge = ({}) => {
  return (
    <div className={styles.doi_badge}>
      <a href='https://doi.org/10.5281/zenodo.1134794'>
        <img src='https://zenodo.org/badge/DOI/10.5281/zenodo.1134794.svg' alt='DOI' />
      </a>
    </div>
  )
}

export default DOIBadge
