import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import immutableUpdate from 'immutable-update';
import deep from 'deep-get-set'
import shallow from 'shallowequal'
import store from '../store'
import { addAllFields } from './field'

const requestRepository = createAction('REQUEST_REPOSITORY')
const receiveRepository = createAction(
  'RECEIVE_REPOSITORY',
  json => json,
  () => ({ receivedAt: Date.now() })
)

const selectDataset = createAction('SELECT_DATASET')
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

export function fetchRepository(id) {
  return function (dispatch) {
    dispatch(requestRepository())
    return fetch('http://localhost:8000/api/v1/dataset/all')
      .then(
        response => response.json(),
        error => console.log('An error occured.', error)
      )
      .then(json =>
        dispatch(receiveRepository(json))
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
    return fetch(`http://localhost:8000/api/v1/dataset/id/${id}`)
      .then(
        response => response.json(),
        error => console.log('An error occured.', error)
      )
      .then(json => {
        json = clearUnderscores(json)
        dispatch(receiveMeta({id,json}))
      })
  }
}

export function loadDataset(id) {
  return function (dispatch) {
    dispatch(selectDataset(id))
    dispatch(fetchMeta(id)).then(() => {
      let meta = deep(store.getState(),['availableDatasets','byId',id])
      addAllFields(dispatch,meta.fields,1)
    })
  }
}

export const selectedDataset = handleAction(
  'SELECT_DATASET',
  (state, action) => (
    action.payload
  ),
  null
)

export const updateFilterList = createAction('UPDATE_FILTER_LIST')

export const filteredList = handleAction(
  'UPDATE_FILTER_LIST',
  (state, action) => {
    return action.payload
  },
  []
)
export const getFilteredList = state => state.filteredList

const filterRangeToList = (low,high,arr,list) => {
  let ret = []
  let len = list.length
  for (var i = 0; i < len; i++){
    if (arr[list[i]] >= low && arr[list[i]] <= high){
      ret.push(list[i]);
    }
  }
  return ret
}

export function filterToList(val) {
  return function(dispatch){
    let state = store.getState();
    let filters = state.filters.byId;
    let fields = state.fields.byId;
    let data = state.rawData.byId;
    let count = state.availableDatasets.byId[state.selectedDataset].records
    let list = [];
    for (var i = 0; i < count; i++){
      list.push(i)
    }
    state.filters.allIds.forEach(id => {
      if (fields[id].active && filters[id]){
        let range = filters[id].range
        let limit = fields[id].range
        if (!shallow(range,limit)){
          list = filterRangeToList(range[0],range[1],data[id].values,list)
        }
      }
    })
    dispatch(updateFilterList(list))
  }
}


export const getDatasetMeta = (state,id) => deep(state,['availableDatasets','byId',id]) || {}
export const getDatasetIsFetching = (state) => (deep(state,['selectedDataset']) == null) || false

export const repositoryReducers = {
  selectedDataset,
  availableDatasets,
  filteredList,
  fetchRepository
}
