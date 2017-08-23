import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Dataset from './Dataset';
import Repository from '../containers/Repository';
import { NotFound } from './Error';

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Repository}/>
      <Route path="/view/:datasetId" component={Dataset}/>
      <Route component={NotFound}/>
    </Switch>
  </main>
)

module.exports = Main;
