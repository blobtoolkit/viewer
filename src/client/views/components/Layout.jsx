import React from 'react'
import { connect } from 'react-redux'
import styles from './Layout.scss'
import { loadDataset, getDatasetIsActive } from '../reducers/repository'
import { getSelectedDataset } from '../reducers/dataset'
import LayoutControls from './LayoutControls'
import LayoutPlots from './LayoutPlots'

class Layout extends React.Component {
  render(){
    return (
      <div className={styles.main}>
        <LayoutPlots/>
        <LayoutControls/>
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
