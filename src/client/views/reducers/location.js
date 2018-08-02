import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import store from '../store'
import qs from 'qs'
import { queryToStore, qsDefault } from '../querySync'
import { byIdSelectorCreator } from './selectorCreators'
import history from './history'

export const setPathname = createAction('SET_PATHNAME')
export const pathname = handleAction(
  'SET_PATHNAME',
  (state, action) => (
    action.payload
  ),
  // TODO: use variable basename
  document.location.pathname.replace(/^\/view/,'') || ''
)
export const getPathname = state => {
  return state.pathname
}

const options = ['blob','cumulative','detail','dataset','report','snail','table','treemap']

export const getViews = createSelector(
  getPathname,
  (pathname) => {
    let path = pathname.replace(/^\//,'').replace(/\/$/,'').split('/')
    let views = {}
    let nextView = undefined
    let primary = undefined
    for (let i = 0; i < path.length; i++){
      if (options.includes(path[i])){
        views[path[i]] = true
        if (!primary && path[i] != 'search' && path[i] != 'dataset'){
          primary = path[i]
        }
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
    views.primary = primary
    return views
  }
)

export const getView = createSelector(
  getViews,
  views => views.primary
)

export const getDatasetID = createSelector(
  getViews,
  views => views.dataset
)

export const getSearchTerm = createSelector(
  getViews,
  views => views.search
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
    if (view != 'dataset' && views[view]){
      pathname += '/' + view
    }
  })
  return pathname
}

export const updatePathname = (update = {},remove = {}) => {
  return function (dispatch) {
    let state = store.getState()
    let views = getViews(state)
    let newViews = {}
    if (views.search) newViews.search = views.search
    if (views.dataset) newViews.dataset = views.dataset
    let primary = views.primary
    Object.keys(update).forEach(key=>{
      newViews[key] = update[key]
      if (key != 'dataset' && options.indexOf(key) != -1){
        primary = key
      }
    })
    Object.keys(remove).forEach(key=>{
      delete newViews[key]
      if (key == primary) primary = false
    })
    if (primary) newViews[primary] = true
    let pathname = viewsToPathname(newViews)
    let currentPathname = getPathname(state)
    let hash = getHashString(state)
    let search = getQueryString(state)
    if (pathname != currentPathname){
      history.push({pathname,hash,search})
      dispatch(setPathname(pathname))
    }
  }
}

export const chooseView = (view) => {
  return function (dispatch) {
    dispatch(updatePathname({[view]:true}))
  }
}


export const setQueryString = createAction('SET_QUERY_STRING')
export const queryString = handleAction(
  'SET_QUERY_STRING',
  (state, action) => (
    action.payload
  ),
  (document.location.search : '').replace('?','')
)
export const getQueryString = state => state.queryString || ''

export const setHashString = createAction('SET_HASH_VALUE')
export const hashString = handleAction(
  'SET_HASH_VALUE',
  (state, action) => (
    action.payload
  ),
  (document.location.hash : '').replace('#','')
)
export const getHashString = state => state.hashString || ''


export const toggleHash = (value) => {
  return function (dispatch) {
    let state = store.getState()
    let currentHash = getHashString(state)
    let currentQuery = getQueryString(state)
    if (currentHash && currentHash == value){
      history.push({hash:'',search:currentQuery})
      dispatch(setHashString(''))
    }
    else {
      history.push({hash:'#'+value,search:currentQuery})
      dispatch(setHashString(value))
    }
  }
}

window.onpopstate  = (e) => {
  let state = store.getState()
  let dataset = getDatasetID(state)
  store.dispatch(setPathname(document.location.pathname))
  let newDataset = getDatasetID(state)
  if (newDataset != dataset){
    store.dispatch(loadDataset(newDataset))
  }
  store.dispatch(setHashString(document.location.hash.replace(/^#/,'')))
  let currentQuery = getQueryString(state)
  let str = document.location.search.replace(/^\?/,'')
  let values = qs.parse(str)
  store.dispatch(queryToStore({values,searchReplace:true,currentQuery,action:'POP'}))
  store.dispatch(setQueryString(str))
}

export const parseQueryString = createSelector(
  getQueryString,
  (str = '') => {
    return qs.parse(str.replace('?',''))
  }
)

const createSelectorForQueryValue = byIdSelectorCreator();

const _getQueryIdAsMemoKey = (queryId) => queryId

export const getQueryValue = createSelectorForQueryValue(
  _getQueryIdAsMemoKey,
  _getQueryIdAsMemoKey,
  parseQueryString,
  (id, parsed) => {
    return parsed[id] || ''
  }
)

export const locationReducers = {
  pathname,
  hashString,
  queryString
}
