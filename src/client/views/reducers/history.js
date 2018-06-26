import { createSelector } from 'reselect'
import { byIdSelectorCreator } from './selectorCreators'
import createHistory from 'history/createBrowserHistory';
import qs from 'qs'
const basename = BASENAME || ''
export const history = createHistory({ basename });
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

export const urlSearchTerm = createSelector(
  (state) => history.location ? history.location.pathname : '',
  (pathname) => {
    let defaultTerm = ''
    if (history.location.pathname.match(/^.+\/dataset\//)){
      defaultTerm = history.location.pathname.replace(/^\//,'').replace(/\/.*/,'')
    }
    else if (history.location.pathname.match(/^\/*[^\/]+\/*$/)){
      defaultTerm = history.location.pathname.replace(/\//,'')
    }
    if (defaultTerm == 'dataset') defaultTerm = ''
    return defaultTerm
  }
)

export const urlDataset = createSelector(
  (state) => history.location ? history.location.pathname : '',
  (pathname) => {
    let dataset = ''
    if (history.location.pathname.match(/dataset/)){
      dataset = pathname.replace(/.*\/dataset\//,'')
    }
    return dataset
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
