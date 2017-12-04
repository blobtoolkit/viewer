import React from 'react'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import { getDatasetIsActive } from '../reducers/repository'
import Dataset from './Dataset';
import Layout from './Layout';
import Repository from './Repository';
import { NotFound } from './Error';

const MainDiv = (active) => (
  <main>
    <Switch>
      <Route exact path='/' component={Repository}/>
      <Route path="/view/:datasetId" component={Dataset}/>
      <Route path="/layout" render={()=>(<Layout {...active}/>)}/>
      <Route component={NotFound}/>
    </Switch>
  </main>
)

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => (
      {
        active: getDatasetIsActive(state)
      }
    )
  }

  render(){
    const ConnectedMain = connect(
      this.mapStateToProps,
      false
    )(MainDiv)
    return (
      <ConnectedMain {...this.props}/>
    )
  }
}

module.exports = Main;
