import React from 'react'
import { connect } from 'react-redux'
import { Router, Switch, Route } from 'react-router-dom'
import { getDatasetIsActive } from '../reducers/repository'
import Dataset from './Dataset';
import Layout from './Layout';
import Repository from './Repository';
import { NotFound } from './Error';
import history from '../reducers/history';
import GetStarted from './GetStarted'
import MainPlot from './MainPlot'
import CumulativePlot from './CumulativePlot'
import SnailPlot from './SnailPlot'
import TablePlot from './TablePlot'
import TreeMapPlot from './TreeMapPlot'

export const Routes = (active) => {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/dataset/:datasetId/blob" render={(props)=>(<MainPlot {...props}/>)}/>
        <Route path="/dataset/:datasetId/cumulative" render={(props)=>(<CumulativePlot {...props}/>)}/>
        <Route path="/dataset/:datasetId/snail" render={(props)=>(<SnailPlot {...props}/>)}/>
        <Route path="/dataset/:datasetId/table" render={(props)=>(<TablePlot {...props}/>)}/>
        <Route path="/dataset/:datasetId/treemap" render={(props)=>(<TreeMapPlot {...props}/>)}/>
        <Route path="/dataset/:datasetId" render={(props)=>(<MainPlot {...props}/>)}/>
        <Route path="/:searchTerm/dataset/:datasetId/blob" render={(props)=>(<MainPlot {...props}/>)}/>
        <Route path="/:searchTerm/dataset/:datasetId/cumulative" render={(props)=>(<CumulativePlot {...props}/>)}/>
        <Route path="/:searchTerm/dataset/:datasetId/snail" render={(props)=>(<SnailPlot {...props}/>)}/>
        <Route path="/:searchTerm/dataset/:datasetId/table" render={(props)=>(<TablePlot {...props}/>)}/>
        <Route path="/:searchTerm/dataset/:datasetId/treemap" render={(props)=>(<TreeMapPlot {...props}/>)}/>
        <Route path="/:searchTerm/dataset/:datasetId" render={(props)=>(<MainPlot {...props}/>)}/>
        <Route render={()=>(<GetStarted />)}/>
      </Switch>
    </Router>
  )
}
