import React from 'react';
import { connect } from 'react-redux'
import styles from './Layout.scss'


const MenuHelpMain = ({}) => {
  return (
    <div className={styles.menu}>
      <p>
        This is an alpha release, full documentation will be added once the viewer
        is more feature-complete.
      </p>
      Further information and code are available in the project <a href="https://github.com/blobtoolkit/viewer">Github repository</a>.
    </div>
  )
};


export default MenuHelpMain
