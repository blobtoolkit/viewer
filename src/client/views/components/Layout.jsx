import React from 'react'
import { connect } from 'react-redux'
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
import { loadDataset } from '../reducers/repository'
import { getSelectedDataset } from '../reducers/dataset'
import { getTopLevelFields } from '../reducers/field'
import { withRouter } from 'react-router-dom'
import { toggleHash, hashValue } from '../reducers/history'


class LayoutComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {activeTabs:(hashValue() ? {[hashValue()]:1} : {})}
  }

  componentWillMount() {
    let datasetId = this.props.match.params.datasetId
    if (datasetId && this.props.topLevelFields.length == 0){
      this.props.onMount(datasetId);
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    if (nextProps.datasetId != this.props.datasetId){
      return true
    }
    return false
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.datasetId !== this.props.datasetId) {
    //  this.props.onMount(nextProps.datasetId);
    console.log(nextProps)
    console.log(this.props)
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
        { this.props.active ? <MainPlot /> : <GetStarted/> }
         {menu}
        <Header tabs={tabs} onTabClick={(tab)=>toggleHash(tab)}/>
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
        topLevelFields: getTopLevelFields(state)
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
        onMount: id => dispatch(loadDataset(id))
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

export default withRouter(Layout);
