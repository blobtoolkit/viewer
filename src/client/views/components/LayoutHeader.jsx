import React from 'react'
import { connect } from 'react-redux'
import { Router, Switch, Route, withRouter } from 'react-router-dom'
import Header from './Header'
import styles from './Layout.scss'
import MenuDatasetMain from './MenuDatasetMain'
import MenuFilterMain from './MenuFilterMain'
import MenuListsMain from './MenuListsMain'
import MenuDisplayMain from './MenuDisplayMain'
import MenuSummaryMain from './MenuSummaryMain'
import MenuHelpMain from './MenuHelpMain'
import { getTopLevelFields } from '../reducers/field'
import { toggleHash, hashValue } from '../reducers/history'


class HeaderLayoutComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    let labels = ['Datasets','Filters','Lists','Settings','Summary','Help']
    let tabs = []
    let activeTab = window.location.hash.replace('#','')
    labels.forEach(tab=>{
      tabs.push({id:tab,active:activeTab == tab})
    })
    return (
      <Header tabs={tabs} onTabClick={(tab)=>{toggleHash(tab)}}/>
    )
  }
}

class LayoutHeader extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      return {
        hashValue: hashValue(state)
      }
    }
  }

  render(){
    const ConnectedLayoutHeader = connect(
      this.mapStateToProps
    )(HeaderLayoutComponent)
    return <ConnectedLayoutHeader {...this.props}/>
  }
}

export default withRouter(LayoutHeader)
