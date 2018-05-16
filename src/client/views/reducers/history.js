import { createSelector } from 'reselect'
import { byIdSelectorCreator } from './selectorCreators'
import createHistory from 'history/createBrowserHistory';
import qs from 'qs'
export const history = createHistory();
export default history;

export const parseQueryString = createSelector(
  (state) => history.location ? history.location.search : '',
  (loc) => {

    let currentQuery = loc//''
    // if (history.location){
    //   currentQuery = history.location.search || ''
    // }
    return qs.parse(currentQuery.replace('?',''))
  }
)

const createSelectorForQueryValue = byIdSelectorCreator();

const _getQueryIdAsMemoKey = (queryId) => queryId

export const getQueryValue = createSelectorForQueryValue(
  _getQueryIdAsMemoKey,
  _getQueryIdAsMemoKey,
  parseQueryString,
  (id, parsed) => {
    return parsed[id]
  }
)

// export const parseQueryString = () => {
//   let currentQuery = history.location.search || ''
//   return qs.parse(currentQuery.replace('?',''))
// }

export const qsDefault = (param,value) => {
  return queryValue(param) || value
}

export const queryValue = (value) => {
  let currentQuery = history.location.search || ''
  let parsed = qs.parse(currentQuery.replace('?',''))
  if (parsed.hasOwnProperty(value) && parsed[value] != 'false'){
    return parsed[value]
  }
  return false
}

export const addQueryValues = (values,search,hash) => {
  let currentSearch = search || history.location.search || ''
  let currentHash = hash || history.location.hash || ''
  let parsed = qs.parse(currentSearch.replace('?',''))
  Object.keys(values).forEach(key => {
    parsed[key] = values[key]
  })
  history.replace({hash:currentHash,search:qs.stringify(parsed)})
}

export const removeQueryValues = (values) => {
  let currentSearch = history.location.search || ''
  let currentHash = history.location.hash || ''
  let parsed = qs.parse(currentSearch.replace('?',''))
  values.forEach(key => {
    delete parsed[key]
  })
  history.push({hash:currentHash,search:qs.stringify(parsed)})
}

export const clearQuery = () => {
  let currentHash = history.location.hash || ''
  history.push({hash:currentHash,search:''})
}

export const hashValue = () => {
  let currentHash = history.location.hash || ''
  return currentHash.replace('#','')
}

export const toggleHash = (value) => {
  let currentHash = hashValue()
  let currentQuery = history.location.search || ''
  if (currentHash && currentHash == value){
    history.push({hash:'',search:currentQuery})
  }
  else {
    history.push({hash:'#'+value,search:currentQuery})
  }
}
