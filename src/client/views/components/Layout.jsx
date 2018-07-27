import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import styles from './Layout.scss'
import { loadDataset, getDatasetIsActive, getReloading, setReloading } from '../reducers/repository'
import { getSelectedDataset } from '../reducers/dataset'
import { getQueryString, setQueryString } from '../reducers/plotParameters'
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
  componentDidMount() {
    let menuDiv = this.refs.menuDiv
    if(menuDiv){
      let activeTab = window.location.hash.replace('#','')
      menuDiv.scrollTop = window.scrollTop[activeTab] || 0
      menuDiv.addEventListener('scroll', e => this.handleScroll(e,activeTab));
    }
    window.onpopstate  = (e) => {
      let newSearch = window.location.search.replace('?','')
      console.log(newSearch)
      console.log(this.props.history.action)
      if (this.props.active){//} && this.props.history.action == 'POP'){
        if (this.props.queryString != newSearch){
          console.log('update')
          this.props.updateStore(newSearch,this.props.queryString,'POP')
        }
      }
      else {
        this.props.updateQueryString(newSearch)
      }
    }


  }

  render(){
    let activeTab = window.location.hash.replace('#','')
    if (!activeTab && !this.props.match.params.datasetId){
      activeTab = 'Datasets'
    }
    let menu = activeTab ? (<div className={styles.menu} ref='menuDiv'><LayoutControls/></div>) : null
    return (
      <div className={styles.main}>
        <div className={styles.main_header}>
          <LayoutHeader/>
        </div>
        <div className={styles.content}>
          {menu}
          <div className={styles.plot_area}>
            {this.props.datasetId ? this.props.active ? <LayoutPlots/> : <Spinner/> : <LayoutPlots/> }
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
        active: getDatasetIsActive(state),
        queryString: getQueryString(state),
        reloading: getReloading(state)
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

export default withRouter(Layout)
