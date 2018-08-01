import React from 'react'
import { connect } from 'react-redux'
import { Router, Switch, Route } from 'react-router-dom'
import Dataset from './Dataset';
import Routes from './Routes';
import Repository from './Repository';
import { NotFound } from './Error';
import history from '../reducers/history';
import Spinner from './Spinner'
import { getDatasetID } from '../reducers/location'
import { getDatasetIsActive, loadDataset } from '../reducers/repository'
import { fetchRepository, getRepositoryIsInitialised, getRepositoryIsFetching } from '../reducers/repository'

class MainDiv extends React.Component {
  componentDidMount(){
    if (!this.props.initialised){
      console.log('loading repository')
      this.props.onLoad()
    }
    else if (!this.props.fetching){
      console.log(this.props.active)
    }
  }

  componentWillUpdate(){
    console.log('updating')
  }

  render(){
    if (!this.props.initialised){
       return null
    }
    console.log(this.props.fetching)
    if (this.props.fetching){
      return <Spinner opacity={1}/>
    }
    console.log(this.props.fetching)

    return (
      <div>
        <Routes/>
      </div>
    )
  }
}


export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => (
      {
        initialised: getRepositoryIsInitialised(state),
        fetching: getRepositoryIsFetching(state),
        datasetId: getDatasetID(state)
      }
    )
    this.mapDispatchToProps = dispatch => (
      {
        onLoad: (searchTerm) => dispatch(fetchRepository(searchTerm))
      }
    )

  }

  render(){
    const ConnectedMain = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(MainDiv)
    return (
      <ConnectedMain {...this.props}/>
    )
  }
}

// module.exports = Main;
