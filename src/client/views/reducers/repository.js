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

const addTopLevelFields = createAction('ADD_TOP_LEVEL_FIELDS')

export const topLevelFields = handleAction(
  'ADD_TOP_LEVEL_FIELDS',
  (state, action) => {
    return (
      action.payload.map(obj => {return obj.id})
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
      state.byId[action.payload.id] = action.payload;
      state.allIds.push(action.payload.id);
      return state;
    }
  },
  {
    byId: {},
    allIds: []
  }
)

const addFilter = createAction('ADD_FILTER')
export const editFilter = createAction('EDIT_FILTER')

export const filters = handleActions(
  {
    ADD_FILTER: (state, action) => {
      state.byId[action.payload.id] = action.payload;
      state.allIds.push(action.payload.id);
      return state;
    },
    EDIT_FILTER: (state, action) => {
      console.log(action);
      state.byId[action.payload.id] = action.payload;
      return state;
    }
  },
  {
    byId: {},
    allIds: []
  }
)

const requestRawData = createAction('REQUEST_RAW_DATA')
const receiveRawData = createAction('RECEIVE_RAW_DATA')
const useStoredRawData = createAction('USE_STORED_RAW_DATA')

export const rawData = handleActions(
  {
    REQUEST_RAW_DATA: (state, action) => (
      state
    ),
    RECEIVE_RAW_DATA: (state, action) => {
      state.byId[action.payload.id] = action.payload.json;
      state.allIds.push(action.payload.id);
      return state;
    },
    USE_STORED_RAW_DATA: (state, action) => (
      state
    )
  },
  {
    byId: {},
    allIds: []
  }
)

export function fetchRawData(id) {
   return dispatch => {
     dispatch(requestRawData(id))
     let json = deep(store.getState(),['rawData','byId',id]);
     if (json && json.records){
       dispatch(useStoredRawData(json))
       return Promise.resolve(useStoredRawData(json));
     }
     let datasetId = deep(store.getState(),['selectedDataset']);
     return fetch(`http://localhost:8000/api/v1/field/${datasetId}/${id}`)
       .then(
         response => response.json(),
         error => console.log('An error occured.', error)
       )
       .then(json => {
         dispatch(receiveRawData({id,json}))
       })
   }
}

const addAllFields = (dispatch,fields,flag,meta) => {
  if (flag) {
    dispatch(clearFields)
    dispatch(addTopLevelFields(fields))
  }
  fields.forEach(field => {
    if (meta){
      Object.keys(meta).forEach(key => {
        if (key != 'children' && key != 'data' && !field.hasOwnProperty(key)){
          field[key] = meta[key];
        }
      })
    }
    dispatch(addField(field))
    if (field._children){
      addAllFields(dispatch,field.children,false,field)
    }
    else {
      if (field.type == 'variable'){
        dispatch(addFilter({id:field.id,range:field.range.slice(0)}))
      }
      if (field.preload == true){
        dispatch(fetchRawData(field.id))
      }
    }
    if (field._data){
      addAllFields(dispatch,field.data,false,field)
    }
  })

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

export const getDatasetMeta = (state,id) => deep(state,['availableDatasets','byId',id]) || {}
export const getDatasetIsFetching = (state) => (deep(state,['selectedDataset']) == null) || false
export const getTopLevelFields = (state) => deep(state,['topLevelFields']) || []
export const getFieldsByParent = (state,id) => deep(state,['fields','byId',id,'children']) || []
export const getFieldMetadata = (state,id) => deep(state,['fields','byId',id]) || {}
//export const getFilterMetadata = (state,id) => deep(state,['filters','byId',id]) || {}

const getFilterMetadata = (state, props) => {
  let id = props.filterId
  const filterMetadataById = deep(state,['filters','byId',id]) || {}
  return filterMetadataById
}
//const getFilterMetadata = (state, id) => deep(state,['fields','byId',id]) || {}
// export const makeGetFilterMetadata = () => createSelector(
//   getFilterMetadata,
//   (meta) => ({ meta })
// )
export const makeGetFilterMetadata = () => createSelector(
  [ getFilterMetadata ],
  (meta) => meta
)

const getFieldRawData = (state, props) => {
  let id = props.fieldId
  const fieldRawDataById = deep(state,['rawData','byId',id]) || {}
  return fieldRawDataById
}

export const makeGetFieldRawData = () => createSelector(
  [ getFieldRawData ],
  (data) => data
)

export const repositoryReducers = {
  fields,
  rawData,
  filters,
  topLevelFields,
  selectedDataset,
  availableDatasets,
  fetchRepository
}
