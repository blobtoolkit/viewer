import { combineReducers } from 'redux'

import { repositoryReducers } from './repository'
import { fieldReducers } from './field'
import { filterReducers } from './filter'

const allReducers = Object.assign(
  {},
  repositoryReducers,
  fieldReducers,
  filterReducers
);

const rootReducer = combineReducers(allReducers);

export default rootReducer
