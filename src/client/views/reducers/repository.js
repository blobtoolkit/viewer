import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import immutableUpdate from 'immutable-update';
import deep from 'deep-get-set'
import shallow from 'shallowequal'
import store from '../store'
import { addAllFields } from './field'

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

export function fetchRepository(id) {
  return function (dispatch) {
    dispatch(requestRepository())
    return fetch(apiUrl + '/dataset/all')
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

export function loadDataset(id) {
  return function (dispatch) {
    dispatch(selectDataset(id))
    dispatch(setDatasetIsActive(false))
    dispatch(fetchMeta(id)).then(() => {
      let meta = deep(store.getState(),['availableDatasets','byId',id])
      addAllFields(dispatch,meta.fields,1,false,id)
    }).then(()=>setTimeout(()=>dispatch(setDatasetIsActive(true)),1000))
  }
}

export const selectDataset = createAction('SELECT_DATASET')
export const selectedDataset = handleAction(
  'SELECT_DATASET',
  (state, action) => (
    action.payload
  ),
  null
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

export const getDatasetIsActive = state => state.datasetIsActive

export const repositoryReducers = {
  selectedDataset,
  availableDatasets,
  fetchRepository,
  datasetIsActive
}
