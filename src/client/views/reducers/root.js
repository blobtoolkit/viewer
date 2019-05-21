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
import { trackingReducers } from './tracking'
import { datasetTableReducers } from './datasetTable'

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
  recordReducers,
  trackingReducers,
  datasetTableReducers
);

const appReducer = combineReducers(allReducers);

const rootReducer = (state, action) => {
  if (action.type === 'REFRESH') {
    let cookieConsent = state.cookieConsent
    let analytics = state.analytics
    let availableDatasets = state.availableDatasets
    let datasetIsActive = state.datasetIsActive
    let staticThreshold = state.staticThreshold
    let pathname = state.pathname
    let hashString = state.hashString
    let datasetPage = state.datasetPage
    let datasetPageSize = state.datasetPageSize
    let datasetSorted = state.datasetSorted
    state = {
      analytics,
      cookieConsent,
      availableDatasets,
      datasetIsActive,
      staticThreshold,
      pathname,
      hashString,
      datasetPage,
      datasetPageSize,
      datasetSorted
    }
  }
  return appReducer(state, action)
}

export default rootReducer
