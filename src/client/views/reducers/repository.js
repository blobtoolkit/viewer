import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import immutableUpdate from 'immutable-update';
import deep from 'deep-get-set'
import shallow from 'shallowequal'
import store from '../store'
import { addAllFields } from './field'
import { filterToList } from './filter'
import { editPlot } from './plot'
import { qsDefault } from '../querySync'
import { history, queryValue, clearQuery, addQueryValues } from './history'
import { getSearchTerm, setSearchTerm } from './search'

const apiUrl = window.apiURL || '/api/v1'

const requestRepository = createAction('REQUEST_REPOSITORY')
const receiveRepository = createAction(
  'RECEIVE_REPOSITORY',
  json => json,
  () => ({ receivedAt: Date.now() })
)

const invalidateDataset = createAction('INVALIDATE_DATASET')
const requestMeta = createAction('REQUEST_META')
const receiveMeta = createAction(
  'RECEIVE_META',
  json => json,
  () => ({ receivedAt: Date.now() })
)
const useStoredMeta = createAction('USE_STORED_META')

const defaultState = () => (
    {
      isFetching: false,
      allIds: [],
      byId: {}
    }
)

export const availableDatasets = handleActions(
  {
    REQUEST_REPOSITORY: (state, action) => ({
      isFetching: true,
      didInvalidate: false
    }),
    RECEIVE_REPOSITORY: (state, action) => ({
      isFetching: false,
      byId: (action.payload).reduce((obj, item) => (obj[item.id] = item, obj) ,{}),
      allIds: (action.payload).map(item => item.id),
      lastUpdated: action.meta.receivedAt
    }),
    INVALIDATE_DATASET: (state, action) => (
      state
    ),
    REQUEST_META: (state, action) => (
      state
    ),
    RECEIVE_META: (state, action) => (
      immutableUpdate(state, {
        byId: { [action.payload.id]: action.payload.json }
      })
    )
  },
  defaultState()
)

export const getRepositoryIsFetching = state => deep(state,'availableDatasets.isFetching') || false

export const getAvailableDatasetIds = state => deep(state,'availableDatasets.allIds') || []

export function fetchRepository(searchTerm) {
  return function (dispatch) {
    dispatch(requestRepository())
    let pathname = history.location.pathname
    let defaultTerm = 'all'
    let dataset = ''
    if (pathname.match(/^.+\/dataset/)){
      defaultTerm = pathname.replace(/^\//,'').replace(/\/.*/,'')
      dataset = pathname.replace(/.*\/dataset\//,'')
    }
    if (searchTerm){
      pathname = '/'+searchTerm+'/dataset/'
    }
    else {
      if (pathname.match(/^dataset/)){
        defaultTerm = pathname.replace('/dataset\/*/','')
      }
      searchTerm = searchTerm || defaultTerm
    }
    let search = history.location.search || ''
    let hash = history.location.hash || ''
    history.replace({pathname,search,hash})
    dispatch(setSearchTerm(searchTerm))
    return fetch(apiUrl + '/search/' + searchTerm)
      .then(
        response => response.json(),
        error => console.log('An error occured.', error)
      )
      .then(json =>{
          if (dataset){
            if (json.find(o=>o.id==dataset)){
              pathname += dataset
              history.replace({pathname,search,hash})
            }
          }
          dispatch(receiveRepository(json))
        }
      )
  }
}

function clearUnderscores(obj) {
  let str = JSON.stringify(obj);
  str = str.replace(/"_/g,'"');
  return JSON.parse(str);
}

export function fetchMeta(id) {
  return dispatch => {
    dispatch(requestMeta(id))
    let json = deep(store.getState(),['availableDatasets','byId',id]);
    if (json && json.records){
      dispatch(useStoredMeta(json))
      return Promise.resolve(useStoredMeta(json));
    }
    return fetch(`${apiUrl}/dataset/id/${id}`)
      .then(
        response => response.json(),
        error => console.log('An error occured.', error)
      )
      .then(json => {
        json = clearUnderscores(json)
        json.fields.unshift({id:'userDefined',children:[{id:'selection'}]})
        dispatch(receiveMeta({id,json}))
      })
  }
}

export const refreshStore = createAction('REFRESH')

export function loadDataset(id,clear) {
  return function (dispatch) {
    let search = history.location.search || ''
    if (clear){
      search = ''
    }
    let pathname = history.location.pathname
    let searchTerm = '/'
    if (pathname.match(/^.+\/dataset/)){
      searchTerm = pathname.replace(/dataset.*/,'')
    }
    dispatch(refreshStore())
    dispatch(selectDataset(id))
    dispatch(setDatasetIsActive(false))
    console.log(searchTerm)
    console.log(id)
    dispatch(fetchMeta(id)).then(() => {
      let meta = deep(store.getState(),['availableDatasets','byId',id])
      let plot = meta.plot
      plot.id = 'default'
      Object.keys(plot).forEach(key=>{
        let qv = queryValue(key+'Field')
        if (qv){
          plot[key] = qv
        }
      })
      let hash = history.location.hash || ''
      history.replace({pathname:searchTerm+'dataset/'+id,search,hash})
      dispatch(editPlot(plot))
      Promise.all(addAllFields(dispatch,meta.fields,1,false))
      .then(()=>{
        dispatch(filterToList())
        dispatch(setDatasetIsActive(true))
      })
    })
  }
}

let dataset = null
if (history.location){
  let path = history.location.pathname
  dataset = path.replace(/\/view\/.+?\/dataset\//,'')
}

export const selectDataset = createAction('SELECT_DATASET')
export const selectedDataset = handleAction(
  'SELECT_DATASET',
  (state, action) => (
    action.payload
  ),
  dataset
)

export const getDatasetMeta = (state,id) => deep(state,['availableDatasets','byId',id]) || {}
export const getDatasetIsFetching = (state) => (deep(state,['selectedDataset']) == null) || false

export const setDatasetIsActive = createAction('SET_DATASET_IS_ACTIVE')
export const datasetIsActive = handleAction(
  'SET_DATASET_IS_ACTIVE',
  (state, action) => (
    action.payload
  ),
  false
)

export function fetchSearchResults(str) {
  return function (dispatch) {
    fetch(apiUrl + '/search/' + str)
      .then(
        response => response.json(),
        error => console.log('An error occured.', error)
      )
  }
}

export const getDatasetIsActive = state => state.datasetIsActive

export const repositoryReducers = {
  selectedDataset,
  availableDatasets,
  fetchRepository,
  datasetIsActive
}
