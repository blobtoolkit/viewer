import React from 'react'
import { connect } from 'react-redux'
import styles from './Layout.scss'
import { loadDataset, getDatasetIsActive } from '../reducers/repository'
import { getSelectedDataset } from '../reducers/dataset'
import LayoutControls from './LayoutControls'
import LayoutHeader from './LayoutHeader'
import LayoutPlots from './LayoutPlots'

class Layout extends React.Component {
  render(){
    let activeTab = window.location.hash.replace('#','')
    let menu = activeTab ? (<div className={styles.menu}><LayoutControls/></div>) : null
    return (
      <div className={styles.main}>
        <div className={styles.main_header}>
          <LayoutHeader/>
        </div>
        <div className={styles.content}>
          {menu}
          <div className={styles.plot_area}>
            <LayoutPlots/>
          </div>
        </div>
      </div>
    )
  }
}

// class Layout extends React.Component {
//   constructor(props) {
//     super(props);
//     this.mapStateToProps = state => {
//       return {
//         selectedDataset: getSelectedDataset(state)
//       }
//     }
//   }
//
//   render(){
//     const ConnectedLayout = connect(
//       this.mapStateToProps
//     )(LayoutComponent)
//     return <ConnectedLayout {...this.props}/>
//   }
// }

export default Layout
