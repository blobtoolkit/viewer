import React from 'react'
import PropTypes from 'prop-types'
import styles from './Spinner.scss';

class Spinner extends React.Component {
  render(){
    return (
      <div className={styles.outer}>
        <div className={styles['lds-ripple']}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className={styles.text}>
          loading
        </div>
      </div>
    )
  }
}
export default Spinner
