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

const options = ['blob','cumulative','dataset','snail','table','treemap']

export const urlViews = createSelector(
  (state) => history.location ? history.location.pathname : '',
  (pathname) => {
    let path = pathname.replace(/^\//,'').replace(/\/$/,'').split('/')
    let views = {}
    let nextView = undefined
    for (let i = 0; i < path.length; i++){
      if (options.includes(path[i])){
        views[path[i]] = true
        nextView = path[i]
      }
      else if (nextView == 'dataset') {
        views['dataset'] = path[i]
        nextView = undefined
      }
      else {
        views['search'] = path[i]
      }
    }
    return views
  }
)

export const viewsToPathname = views => {
  let pathname = ''
  if (views['search']){
    pathname += '/' + views['search']
  }
  if (views['dataset']){
    pathname += '/dataset/' + views['dataset']
  }
  options.forEach(view => {
    if (view != 'dataset' && views['view']){
      pathname += '/' + view
    }
  })
  return pathname
}

export const urlSearchTerm = createSelector(
  urlViews,
  (views) => {
    let searchTerm = ''
    if (views.search){
      searchTerm = views.search
    }
    return searchTerm
  }
)

export const urlDataset = createSelector(
  urlViews,
  (views) => {
    let dataset = ''
    if (views.dataset){
      dataset = views.dataset
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
