import { combineReducers } from 'redux'

import { repositoryReducers } from './repository'
import { fieldReducers } from './field'
import { filterReducers } from './filter'
import { dimensionReducers } from './dimension'
import { colorReducers } from './color'
import { plotReducers } from './plot'
import { selectReducers } from './select'
import { plotParameterReducers } from './plotParameters'

const allReducers = Object.assign(
  {},
  repositoryReducers,
  fieldReducers,
  filterReducers,
  dimensionReducers,
  colorReducers,
  plotReducers,
  selectReducers,
  plotParameterReducers
);

const rootReducer = combineReducers(allReducers);

export default rootReducer
