import { combineReducers } from 'redux'

import { locationReducers } from './location'
import { searchReducers } from './search'
import { repositoryReducers } from './repository'
import { fieldReducers } from './field'
import { filterReducers } from './filter'
import { listReducers } from './list'
import { identifierReducers } from './identifiers'
import { dimensionReducers } from './dimension'
import { colorReducers } from './color'
import { plotReducers } from './plot'
import { selectReducers } from './select'
import { plotParameterReducers } from './plotParameters'
import { recordReducers } from './record'

const allReducers = Object.assign(
  {},
  locationReducers,
  searchReducers,
  repositoryReducers,
  fieldReducers,
  filterReducers,
  listReducers,
  identifierReducers,
  dimensionReducers,
  colorReducers,
  plotReducers,
  selectReducers,
  plotParameterReducers,
  recordReducers
);

const appReducer = combineReducers(allReducers);

const rootReducer = (state, action) => {
  if (action.type === 'REFRESH') {
    let availableDatasets = state.availableDatasets
    let datasetIsActive = state.datasetIsActive
    let staticThreshold = state.staticThreshold
    let pathname = state.pathname
    let hashString = state.hashString
    state = {availableDatasets,datasetIsActive,staticThreshold,pathname,hashString}
  }
  return appReducer(state, action)
}

export default rootReducer
