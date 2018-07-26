import React from 'react'
import styles from './Layout.scss'
import DOIBadge from './DOIBadge'
import BTKLogos from './BTKLogos'


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
      <DOIBadge/>
      <BTKLogos/>
    </div>
  )
}

module.exports = Header;
