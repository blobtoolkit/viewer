import { combineReducers } from 'redux'

import * as repositoryReducers from './repository'
import * as datasetReducers from './dataset'

const allReducers = Object.assign({}, repositoryReducers, datasetReducers);
const rootReducer = combineReducers(allReducers);

export default rootReducer
