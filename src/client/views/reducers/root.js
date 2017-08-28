import { combineReducers } from 'redux'

import { repositoryReducers } from './repository'
import { datasetReducers } from './dataset'
import { fieldReducers } from './fields'

const allReducers = Object.assign({}, repositoryReducers, datasetReducers, fieldReducers);
const rootReducer = combineReducers(allReducers);

export default rootReducer
