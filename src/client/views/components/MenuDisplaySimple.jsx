import React from 'react'
import { connect } from 'react-redux'
import styles from './Layout.scss';
import Spinner from './Spinner'

class MenuDisplaySimple extends React.Component {
  render(){
    return (
      <div className={styles.simple}>
        <h1 className={styles.inline}>{this.props.name}</h1>
        <span className={styles.simple_buttons}>
          {this.props.children}
        </span>
      </div>
    )
  }
}


export default MenuDisplaySimple
