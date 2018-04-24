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
import { loadDataset } from '../reducers/repository'
import { getSelectedDataset } from '../reducers/dataset'


class LayoutComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {activeTabs:{'Datasets':1}}
  }
  changeTab(tab){
    if (this.state.activeTabs.hasOwnProperty(tab)){
      this.setState({activeTabs:{}})
    }
    else {
      this.setState({activeTabs:{[tab]:1}})
    }
  }

  componentDidMount(){
    let datasetId = this.props.match.params.datasetId
    let selectedId = this.props.selectedDataset
    if (datasetId && datasetId != selectedId){
      this.props.onMount(datasetId)
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
        { this.props.active ? <MainPlot /> : '' }
         {menu}
        <Header tabs={tabs} onTabClick={(tab)=>this.changeTab(tab)}/>
      </div>
    )
  }
}



class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      return {
        selectedDataset: getSelectedDataset(state)
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


export default Layout;
