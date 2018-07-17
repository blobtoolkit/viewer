import React from 'react'
import { connect } from 'react-redux'
import { Router, Switch, Route } from 'react-router-dom'
import { getDatasetIsActive } from '../reducers/repository'
import Dataset from './Dataset';
import Routes from './Routes';
import Repository from './Repository';
import { NotFound } from './Error';
import history from '../reducers/history';
// import { fetchRepository } from '../reducers/repository'


const Main = () => (
  <div>
    <Routes/>
  </div>
)

export default Main
// class Main extends React.Component {
//   constructor(props) {
//     super(props);
//     this.mapStateToProps = state => (
//       {
//         active: getDatasetIsActive(state)
//       }
//     )
//
//   }
//
//   render(){
//     const ConnectedMain = connect(
//       this.mapStateToProps
//     )(MainDiv)
//     return (
//       <ConnectedMain {...this.props}/>
//     )
//   }
// }
//
// module.exports = Main;
