import React from 'react'
import { connect } from 'react-redux'
import { Router, Switch, Route } from 'react-router-dom'
import Header from './Header'
import styles from './Layout.scss'
import MenuDatasetMain from './MenuDatasetMain'
import MenuFilterMain from './MenuFilterMain'
import MenuListsMain from './MenuListsMain'
import MenuDisplayMain from './MenuDisplayMain'
import MenuSummaryMain from './MenuSummaryMain'
import MenuHelpMain from './MenuHelpMain'
import MainPlot from './MainPlot'
import GetStarted from './GetStarted'
import { loadDataset, getDatasetIsActive } from '../reducers/repository'
import { getSelectedDataset } from '../reducers/dataset'
import { getTopLevelFields } from '../reducers/field'
import { withRouter } from 'react-router-dom'
import { toggleHash, hashValue } from '../reducers/history'
import { Routes } from './Routes'


class LayoutComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {activeTabs:(hashValue() ? {[hashValue()]:1} : {})}
  }

  toggleState(tab){
    if (this.state.activeTabs.hasOwnProperty(tab)){
      this.setState({activeTabs:{}})
    }
    else {
      this.setState({activeTabs:{[tab]:1}})
    }
  }

  render(){
    let labels = ['Datasets','Filters','Lists','Settings','Summary','Help']
    let tabs = []
    labels.forEach(tab=>{
      tabs.push({id:tab,active:this.state.activeTabs.hasOwnProperty(tab)})
    })
    let menu
    if (this.state.activeTabs.hasOwnProperty('Datasets')) menu = <MenuDatasetMain />
    if (this.state.activeTabs.hasOwnProperty('Filters')) menu = <MenuFilterMain offset='0em'/>
    if (this.state.activeTabs.hasOwnProperty('Lists')) menu = <MenuListsMain offset='0em'/>
    if (this.state.activeTabs.hasOwnProperty('Settings')) menu = <MenuDisplayMain offset='0em'/>
    if (this.state.activeTabs.hasOwnProperty('Summary')) menu = <MenuSummaryMain offset='0em'/>
    if (this.state.activeTabs.hasOwnProperty('Help')) menu = <MenuHelpMain offset='0em'/>
    return (
      <div className={styles.main}>
        { this.props.active ? <Routes active={this.props.active}/> : <GetStarted/> }
         {this.props.active ? menu : menu ? menu : <MenuDatasetMain /> }
        <Header tabs={tabs} onTabClick={(tab)=>{this.toggleState(tab);toggleHash(tab)}}/>
      </div>
    )
  }
}

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      return {
        selectedDataset: getSelectedDataset(state),
        topLevelFields: getTopLevelFields(state),
        active: getDatasetIsActive(state),
        hashValue: hashValue(state)
      }
    }
  }

  render(){
    const ConnectedLayout = connect(
      this.mapStateToProps
    )(LayoutComponent)
    return <ConnectedLayout {...this.props}/>
  }
}

export default withRouter(Layout)
