import React from 'react'
import { connect } from 'react-redux'
import { Router, Switch, Route, withRouter } from 'react-router-dom'
import styles from './Layout.scss'
import MenuDatasetMain from './MenuDatasetMain'
import MenuFilterMain from './MenuFilterMain'
import MenuListsMain from './MenuListsMain'
import MenuDisplayMain from './MenuDisplayMain'
import MenuSummaryMain from './MenuSummaryMain'
import MenuHelpMain from './MenuHelpMain'
import { getTopLevelFields } from '../reducers/field'
import { toggleHash, hashValue } from '../reducers/history'


class ControlsLayoutComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    let labels = ['Datasets','Filters','Lists','Settings','Summary','Help']
    let tabs = []
    let activeTab = window.location.hash.replace('#','')
    if (!activeTab && !this.props.match.params.datasetId){
      activeTab = 'Datasets'
    }
    labels.forEach(tab=>{
      tabs.push({id:tab,active:activeTab == tab})
    })
    let menu
    if (activeTab == 'Datasets') menu = <MenuDatasetMain />
    if (activeTab == 'Filters') menu = <MenuFilterMain/>
    if (activeTab == 'Lists') menu = <MenuListsMain/>
    if (activeTab == 'Settings') menu = <MenuDisplayMain/>
    if (activeTab == 'Summary') menu = <MenuSummaryMain/>
    if (activeTab == 'Help') menu = <MenuHelpMain/>
    return (
      <div className={styles.fill_parent}>
        {menu}
      </div>
    )
  }
}

class LayoutControls extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      return {
        topLevelFields: getTopLevelFields(state),
        hashValue: hashValue(state)
      }
    }
  }

  render(){
    const ConnectedLayout = connect(
      this.mapStateToProps
    )(ControlsLayoutComponent)
    return <ConnectedLayout {...this.props}/>
  }
}

export default withRouter(LayoutControls)
