import { combineReducers } from 'redux'

import { repositoryReducers } from './repository'
import { fieldReducers } from './field'
import { filterReducers } from './filter'
import { dimensionReducers } from './dimension'
import { colorReducers } from './color'
import { plotReducers } from './plot'

const allReducers = Object.assign(
  {},
  repositoryReducers,
  fieldReducers,
  filterReducers,
  dimensionReducers,
  colorReducers,
  plotReducers
);

const rootReducer = combineReducers(allReducers);

export default rootReducer
