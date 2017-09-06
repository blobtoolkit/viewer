import { combineReducers } from 'redux'

import { repositoryReducers } from './repository'
import { fieldReducers } from './field'
import { filterReducers } from './filter'
import { dimensionReducers } from './dimension'

const allReducers = Object.assign(
  {},
  repositoryReducers,
  fieldReducers,
  filterReducers,
  dimensionReducers
);

const rootReducer = combineReducers(allReducers);

export default rootReducer
