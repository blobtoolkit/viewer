import React from 'react'
import { connect } from 'react-redux'
import { Router, Switch, Route } from 'react-router-dom'
import { getDatasetIsActive } from '../reducers/repository'
import Dataset from './Dataset';
import Layout from './Layout';
import Repository from './Repository';
import { NotFound } from './Error';
import history from '../reducers/history';
// import { fetchRepository } from '../reducers/repository'


const MainDiv = (active) => (
  <main>
    <Router history={history}>
      <Switch>
        <Route path="/dataset/:datasetId?" render={(props)=>(<Layout {...active} {...props}/>)}/>
        <Route path="/:searchTerm/dataset/:datasetId?" render={(props)=>(<Layout {...active} {...props}/>)}/>
        <Route render={()=>(<Layout {...active}/>)}/>
      </Switch>
    </Router>
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
    // this.mapDispatchToProps = dispatch => (
    //   {
    //     onLoadLayout: term => dispatch(fetchRepository(term))
    //   }
    // )
  }

  render(){
    const ConnectedMain = connect(
      this.mapStateToProps,
      false//this.mapDispatchToProps
    )(MainDiv)
    return (
      <ConnectedMain {...this.props}/>
    )
  }
}

module.exports = Main;
