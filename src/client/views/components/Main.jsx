import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { getDatasetIsActive } from '../reducers/repository'
import Dataset from './Dataset';
import Layout from './Layout';
import Repository from './Repository';
import { NotFound } from './Error';
import { createHistory, createBrowserHistory } from 'history';

// const browserHistory = createBrowserHistory({
//   basename: '/demo'
// });

const MainDiv = (active) => (
  <main>
    <BrowserRouter basename='/demo'>
      <Switch>
        <Route path="/view/:datasetId" render={(props)=>(<Layout {...active} {...props}/>)}/>
        <Route path="/layout" render={()=>(<Layout {...active}/>)}/>
        <Route render={()=>(<Layout {...active}/>)}/>
      </Switch>
    </BrowserRouter>
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
