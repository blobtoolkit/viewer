import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import immutableUpdate from 'immutable-update';
import deep from 'deep-get-set'
import shallow from 'shallowequal'
import store from '../store'
import { addAllFields } from './field'
import { filterToList } from './filter'
import { editPlot } from './plot'
import qs from 'qs'
import { qsDefault, queryToStore } from '../querySync'
import { history } from './history'
// import { getSearchTerm, setSearchTerm } from './search'
import { fetchIdentifiers } from './identifiers'
import { getDatasetID,
  getViews,
  getSearchTerm,
  updatePathname,
  viewsToPathname,
  getQueryValue,
  getQueryString,
  getHashString } from './location'

const apiUrl = API_URL || '/api/v1'

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
      isInitialised: false,
      isFetching: false,
      allIds: [],
      byId: {}
    }
)

export const availableDatasets = handleActions(
  {
    REQUEST_REPOSITORY: (state, action) => (
      immutableUpdate(state, {
        isFetching: true,
        isInitialised: true,
        didInvalidate: false
      })
    ),
    RECEIVE_REPOSITORY: (state, action) => (
      immutableUpdate(state, {
        isFetching: false,
        isInitialised: true,
        byId: (action.payload).reduce((obj, item) => (obj[item.id] = item, obj) ,{}),
        allIds: (action.payload).map(item => item.id),
        lastUpdated: action.meta.receivedAt
      })
    ),
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

export const getRepositoryIsFetching = state => state.availableDatasets.isFetching

export const getRepositoryIsInitialised = state => deep(state,'availableDatasets.isInitialised') || false

export const getAvailableDatasetIds = state => deep(state,'availableDatasets.allIds') || []

export function fetchRepository(searchTerm) {
  return function (dispatch) {
    dispatch(setDatasetIsActive(false))
    dispatch(requestRepository())
    let state = store.getState()
    let views = getViews(state)
    let datasetId = getDatasetID(state)
    let currentTerm = getSearchTerm(state)
    let setSearch = false
    let reload = false
    if (!searchTerm){
      reload = true
      searchTerm = currentTerm
      if (!searchTerm){
        searchTerm = datasetId
        if (searchTerm){
          setSearch = true
        }
      }
      else {
        setSearch = true
      }
    }
    else if (searchTerm != currentTerm){
      setSearch = true
    }
    if (setSearch){
      dispatch(updatePathname({search:searchTerm}))
    }
    dispatch(refreshStore())

    return fetch(apiUrl + '/search/' + searchTerm)
      .then(
        response => response.json(),
        error => console.log('An error occured.', error)
      )
      .then(json =>{
        if (datasetId){
          if (!reload){
            if (json.length != 1){
              dispatch(updatePathname({},{dataset:true,[views.primary]:true}))
            }
            else if (json[0].id != datasetId){
              dispatch(updatePathname({dataset:json[0].id},{[views.primary]:true}))
            }
          }
        }
        else if (json.length == 1){
          dispatch(updatePathname({dataset:json[0].id},{[views.primary]:true}))
        }
        else {
          dispatch(updatePathname({},{dataset:true,[views.primary]:true}))
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

window.firstLoad = true

export function loadDataset(id,clear) {
  return function (dispatch) {
    let state = store.getState()
    clear = false
    dispatch(setDatasetIsActive('loading'))

    // dispatch(refreshStore())
    if (!window.firstLoad){
      dispatch(refreshStore())
      dispatch(queryToStore({values:{},searchReplace:true}))
    }

    // dispatch(selectDataset(id))
    dispatch(fetchMeta(id)).then(() => {
      let meta = deep(store.getState(),['availableDatasets','byId',id])
      let plot = meta.plot
      window.plot = plot
      plot.id = 'default'
      Object.keys(plot).forEach(key=>{
        let qv = getQueryValue(key+'Field')
        if (qv){
          plot[key] = qv
        }
      })
      dispatch(editPlot(plot))
      Promise.all(addAllFields(dispatch,meta.fields,1,false))
      .then(()=>{
        if (window.firstLoad){
          dispatch(queryToStore({values:qs.parse(getQueryString(state))}))
          window.firstLoad = false
          dispatch(filterToList())
        }
        else {
          dispatch(filterToList())
        }
        window.scrollTop = {}
      })
      .then(()=>{
        dispatch(setDatasetIsActive(true))
        dispatch(fetchIdentifiers())
      })

    })
  }
}

export const getDatasetMeta = (state,id) => deep(state,['availableDatasets','byId',id]) || {}
export const getDatasetIsFetching = (state) => false //(deep(state,['selectedDataset']) == null) || false

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

export const getDatasetIsActive = state => {
  return state.datasetIsActive
}

export const setReloading = createAction('RELOADING')
export const reloading = handleAction(
  'RELOADING',
  (state, action) => (
    action.payload
  ),
  false
)
export const getReloading = state => state.reloading

export const repositoryReducers = {
  availableDatasets,
  fetchRepository,
  datasetIsActive,
  reloading
}
