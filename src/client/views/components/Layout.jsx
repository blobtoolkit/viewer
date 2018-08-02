import React from 'react'
import { connect } from 'react-redux'
import styles from './Layout.scss'
import { loadDataset, getDatasetIsActive, getReloading, setReloading } from '../reducers/repository'
import { getQueryString, setQueryString, getDatasetID, getHashString } from '../reducers/location'
import LayoutControls from './LayoutControls'
import LayoutHeader from './LayoutHeader'
import LayoutPlots from './LayoutPlots'
import Spinner from './Spinner'
import DOIBadge from './DOIBadge'
import { queryToStore } from '../querySync'
import qs from 'qs'

window.scrollTop = {}

class LayoutComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  handleScroll(e,tab){
    window.scrollTop[tab] = e.target.scrollTop
  }

  render(){
    // {this.props.datasetId ? this.props.active ? <LayoutPlots/> : <Spinner/> : <LayoutPlots/> }
    return (
      <div className={styles.main}>
        <div className={styles.main_header}>
          <LayoutHeader/>
        </div>
        <div className={styles.content}>
          <LayoutControls/>
          <div className={styles.plot_area}>
            <LayoutPlots />
          </div>
        </div>
        <div className={styles.main_footer}>
          <DOIBadge/>
        </div>
      </div>
    )
  }
}

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      return {
        // active: getDatasetIsActive(state),
        queryString: getQueryString(state),
        reloading: getReloading(state),
        // datasetId: getDatasetID(state),
        activeTab: getHashString(state)
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
        updateStore: (str,currentSearch,action) => {
          let values = qs.parse(str.replace('?',''))
          dispatch(queryToStore({values,searchReplace:true,currentSearch,action}))
        },
        updateQueryString: (qStr) => dispatch(setQueryString(qStr))
      }
    }
  }

  render(){
    const ConnectedLayout = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(LayoutComponent)
    return <ConnectedLayout {...this.props}/>
  }
}

export default Layout
