import React from 'react'
import { Link } from 'react-router-dom'
import Header from './Header'
import styles from './Layout.scss'
import MenuDatasetMain from './MenuDatasetMain'
import MenuFilterMain from './MenuFilterMain'

const Layout = () => {
  let tabs = [{id:'Datasets',active:true},{id:'Filters'},{id:'Plots'},{id:'Settings'}]
  let menu = (<span><MenuDatasetMain /><MenuFilterMain offset='20.5em'/></span>)
  return (
    <div className={styles.main}>
      {menu}
      <Header tabs={tabs}/>
    </div>
  )
}

export default Layout;
