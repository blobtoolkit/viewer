import React from 'react'
import { connect } from 'react-redux'
import Header from './Header'
import styles from './Layout.scss'
import MenuDatasetMain from './MenuDatasetMain'
import MenuFilterMain from './MenuFilterMain'
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
    let labels = ['Datasets','Filters','Display','Help']
    let tabs = []
    labels.forEach(tab=>{
      tabs.push({id:tab,active:this.state.activeTabs.hasOwnProperty(tab)})
    })
    let menu
    if (this.state.activeTabs.hasOwnProperty('Datasets')) menu = <MenuDatasetMain />
    if (this.state.activeTabs.hasOwnProperty('Filters')) menu = <MenuFilterMain offset='0em'/>
    if (this.state.activeTabs.hasOwnProperty('Display')) menu = <MenuDisplayMain offset='0em'/>
    if (this.state.activeTabs.hasOwnProperty('Help')) menu = <MenuHelpMain offset='0em'/>
    return (
      <div className={styles.main}>
        <MainPlot />
        {menu}
        <Header tabs={tabs} onTabClick={(tab)=>this.changeTab(tab)}/>
      </div>
    )
  }
}

export default Layout;
