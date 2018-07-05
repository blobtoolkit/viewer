import React from 'react'
import { connect } from 'react-redux'
import { Router, Switch, Route } from 'react-router-dom'
import styles from './Layout.scss'
import GetStarted from './GetStarted'
import { loadDataset, getDatasetIsActive } from '../reducers/repository'
import { withRouter } from 'react-router-dom'
import { Routes } from './Routes'


class PlotsLayoutComponent extends React.Component {
  render(){
    return (
      <div className={styles.fill_parent}>
        {this.props.active ? <Routes active={this.props.active}/> : <GetStarted/>}
      </div>
    )
  }
}

class LayoutPlots extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      return {
        active: getDatasetIsActive(state)
      }
    }
  }

  render(){
    const ConnectedLayout = connect(
      this.mapStateToProps
    )(PlotsLayoutComponent)
    return <ConnectedLayout {...this.props}/>
  }
}

export default withRouter(LayoutPlots)
