import React from 'react'
import { connect } from 'react-redux'
import { Router, Switch, Route } from 'react-router-dom'
import { getDatasetIsActive, getReloading } from '../reducers/repository'
import Dataset from './Dataset';
import Routes from './Routes';
import Repository from './Repository';
import { NotFound } from './Error';
import history from '../reducers/history';
import Spinner from './Spinner'
// import { fetchRepository } from '../reducers/repository'


const MainDiv = ({reloading}) => {
  return (
    <div>
      <Routes/>
    </div>
  )
}


export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => (
      {
        active: getDatasetIsActive(state),
        reloading: getReloading(state)
      }
    )

  }

  render(){
    const ConnectedMain = connect(
      this.mapStateToProps
    )(MainDiv)
    return (
      <ConnectedMain {...this.props}/>
    )
  }
}

// module.exports = Main;
