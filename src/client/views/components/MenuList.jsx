import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styles from './Layout.scss';
import { Link } from 'react-router-dom'
import Spinner from './Spinner'
import { createSelector } from 'reselect'
import { getDatasetMeta } from '../reducers/repository'

class MenuList extends React.Component {
  render(){
    let css = styles.menu_item
    if (this.props.active) css += ' '+styles.active
    return (
      <div className={css} onClick={()=>{this.props.onListClick(this.props.id)}}>
        <h3>{this.props.id}</h3>
        <span className={styles.menu_subtitle}>{this.props.list.length}</span>
      </div>
    )
  }
}


export default MenuList
