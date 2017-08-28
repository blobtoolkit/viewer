import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import deep from 'deep-get-set'
import store from '../store'

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
    RECEIVE_META: (state, action) => {
      state.byId[action.payload.id] = action.payload.json;
      return state;
    }
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

export function fetchMeta(id) {
  return dispatch => {
    dispatch(requestMeta(id))
    let json = deep(store.getState(),['availableDatasets','byId',id]);
    console.log(store.getState())
    if (json && json.records){
      dispatch(useStoredMeta(json))
      return Promise.resolve(useStoredMeta(json));
    }
    return fetch(`http://localhost:8000/api/v1/dataset/id/${id}`)
      .then(
        response => response.json(),
        error => console.log('An error occured.', error)
      )
      .then(json =>
        dispatch(receiveMeta({id,json}))
      )
  }
}

const addTopLevelFields = createAction('ADD_TOP_LEVEL_FIELDS')

export const topLevelFields = handleAction(
  'ADD_TOP_LEVEL_FIELDS',
  (state, action) => {
    return (
      action.payload.map(obj => {return obj._id || obj.id})
  )},
  []
)

const addField = createAction('ADD_FIELD')
const addFields = createAction('ADD_FIELDS')
const replaceFields = createAction('REPLACE_FIELDS')
const clearFields = createAction('CLEAR_FIELDS')

export const fields = handleActions(
  {
    ADD_FIELD: (state, action) => {
      state.byId[action.payload._id] = action.payload;
      state.allIds.push(action.payload._id);
      return state;
    }
  },
  {
    byId: {},
    allIds: []
  }
)

const addAllFields = (dispatch,fields,flag,meta) => {
  if (flag) {
    dispatch(clearFields)
    dispatch(addTopLevelFields(fields))
  }
  fields.forEach(field => {
    if (meta){
      Object.keys(meta).forEach(key => {
        if (key != '_children' && key != '_data' && !field.hasOwnProperty(key)){
          field[key] = meta[key];
        }
      })
    }
    dispatch(addField(field))
    if (field._children){
      addAllFields(dispatch,field._children,false,field)
    }
    if (field._data){
      addAllFields(dispatch,field._data,false,field)
    }
  })

}

export function loadDataset(id) {
  return function (dispatch) {
    dispatch(fetchMeta(id)).then(() => {
      let meta = deep(store.getState(),['availableDatasets','byId',id])
      addAllFields(dispatch,meta.fields,1)
      dispatch(selectDataset(id))
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

export const getDatasetMeta = (state,id) => deep(state,['availableDatasets','byId',id]) || {}
export const getDatasetIsFetching = (state) => (deep(state,['selectedDataset']) == null) || false
export const getTopLevelFields = (state) => deep(state,['topLevelFields']) || []

export const repositoryReducers = {
  fields,
  topLevelFields,
  selectedDataset,
  availableDatasets,
  fetchRepository
}
