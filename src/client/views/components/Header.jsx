import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Layout.scss'

const Header = ( { tabs, onTabClick } ) => {
  let children = tabs.map((tab,i) => {
    let css = styles.main_header_tab
    if (tab.active){
      css += ' '+styles.active
    }
    return (
      <span className={css}
        key={i}
        onClick={()=>onTabClick(tab.id)}>
        <h2>{tab.id}</h2>
      </span>
    )
  })
  return (
    <div className={styles.main_header}>
      {children}
    </div>
  )
}

module.exports = Header;
