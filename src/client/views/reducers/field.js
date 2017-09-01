import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import deep from 'deep-get-set'
import store from '../store'
import { addFilter } from './filter'

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

export const addAllFields = (dispatch,fields,flag,meta) => {
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


export const getTopLevelFields = (state) => deep(state,['topLevelFields']) || []
export const getFieldsByParent = (state,id) => deep(state,['fields','byId',id,'children']) || []
export const getFieldMetadata = (state,id) => deep(state,['fields','byId',id]) || {}


const getFieldRawData = (state, props) => {
  let id = props.fieldId
  const fieldRawDataById = deep(state,['rawData','byId',id]) || {}
  return fieldRawDataById
}

export const makeGetFieldRawData = () => createSelector(
  [ getFieldRawData ],
  (data) => data
)

export const fieldReducers = {
  fields,
  rawData,
  topLevelFields
}
