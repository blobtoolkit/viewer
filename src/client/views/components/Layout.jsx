import React from 'react'
import { connect } from 'react-redux'
import Header from './Header'
import styles from './Layout.scss'
import MenuDatasetMain from './MenuDatasetMain'
import MenuFilterMain from './MenuFilterMain'
import MenuListsMain from './MenuListsMain'
import MenuDisplayMain from './MenuDisplayMain'
import MenuHelpMain from './MenuHelpMain'
import MainPlot from './MainPlot'

class Layout extends React.Component {
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
  render(){
    let labels = ['Datasets','Filters','Lists','Settings','Help']
    let tabs = []
    labels.forEach(tab=>{
      tabs.push({id:tab,active:this.state.activeTabs.hasOwnProperty(tab)})
    })
    console.log(this.props.active)
    let menu
    if (this.state.activeTabs.hasOwnProperty('Datasets')) menu = <MenuDatasetMain />
    if (this.state.activeTabs.hasOwnProperty('Filters')) menu = <MenuFilterMain offset='0em'/>
    if (this.state.activeTabs.hasOwnProperty('Lists')) menu = <MenuListsMain offset='0em'/>
    if (this.state.activeTabs.hasOwnProperty('Settings')) menu = <MenuDisplayMain offset='0em'/>
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

export default Layout;
