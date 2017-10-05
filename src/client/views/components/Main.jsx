import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Dataset from './Dataset';
import Layout from './Layout';
import Repository from './Repository';
import { NotFound } from './Error';

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Repository}/>
      <Route path="/view/:datasetId" component={Dataset}/>
      <Route path="/layout" component={Layout}/>
      <Route component={NotFound}/>
    </Switch>
  </main>
)

module.exports = Main;
