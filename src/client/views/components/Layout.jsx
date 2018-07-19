import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import styles from './Layout.scss'
import { loadDataset, getDatasetIsActive } from '../reducers/repository'
import { getSelectedDataset } from '../reducers/dataset'
import { getQueryString, setQueryString } from '../reducers/plotParameters'
import LayoutControls from './LayoutControls'
import LayoutHeader from './LayoutHeader'
import LayoutPlots from './LayoutPlots'
import { queryToStore } from '../querySync'
import qs from 'qs'

class LayoutComponent extends React.Component {
  componentDidMount() {
    let newSearch = this.props.location.search.replace('?','')
    if (this.props.active && this.props.history.action == 'POP'){
      if (this.props.queryString != newSearch){
        this.props.updateStore(newSearch,this.props.queryString)
      }
      //this.props.updateStore(this.props.location.search)
    }
    else {
      this.props.updateQueryString(newSearch)
    }
    // this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
  }

  // routerWillLeave(nextState) { // return false to block navigation, true to allow
  //   if (nextState.action === 'POP') {
  //     console.log('popping')
  //     // handle "Back" button clicks here
  //   }
  // }

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

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      return {
        active: getDatasetIsActive(state),
        queryString: getQueryString(state)
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
        updateStore: (str,qStr) => {
          let values = qs.parse(str.replace('?',''))
          queryToStore(dispatch,values,true,false,qStr)
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

export default withRouter(Layout)
