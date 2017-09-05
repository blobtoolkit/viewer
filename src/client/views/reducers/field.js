import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector, createSelectorCreator } from 'reselect'
import immutableUpdate from 'immutable-update';
import deep from 'deep-get-set'
import shallow from 'shallowequal'
import store from '../store'
import { addFilter } from './filter'
import * as d3 from 'd3'

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
export const editField = createAction('EDIT_FIELD')
const addFields = createAction('ADD_FIELDS')
const replaceFields = createAction('REPLACE_FIELDS')
const clearFields = createAction('CLEAR_FIELDS')

export const fields = handleActions(
  {
    ADD_FIELD: (state, action) => (
      immutableUpdate(state, {
        byId: { [action.payload.id]: action.payload },
        allIds: [...state.allIds, action.payload.id]
      })
    ),
    EDIT_FIELD: (state, action) => {
      let id = action.payload.id
      let fields = Object.keys(action.payload).filter((key)=>{return key != 'id'})
      return immutableUpdate(state, {
        byId: {
          [id]: Object.assign(...fields.map(f => ({[f]: action.payload[f]})))
        }
      })
    }
  },
  {
    byId: {},
    allIds: []
  }
)

const hashCode = (json) => {
  let string = JSON.stringify(json)
  let hash = 0, i, chr;
  if (string.length === 0) return hash;
  for (i = 0; i < string.length; i++) {
    chr   = string.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

// https://github.com/reactjs/reselect/issues/100
const createSelectorForFieldId = createSelectorCreator((resultFunc) => {
  const memoAll = {};
  return (fieldId, ...args) => {
    if (!memoAll[fieldId]) {
      memoAll[fieldId] = {};
    }
    const memo = memoAll[fieldId];
    if (!shallow(memo.lastArgs, args)) {
      memo.lastArgs = args;
      memo.lastResult = resultFunc(...args);
    }
    return memo.lastResult;
  };
});

const _getFieldIdAsMemoKey = (state, fieldId) => fieldId;
export const getMetaDataForField = (state, fieldId) => state.fields.byId[fieldId];

export const getDetailsForFieldId = createSelectorForFieldId(
  _getFieldIdAsMemoKey,
  getMetaDataForField,
  (meta = {}) => {
    let range = meta.range || [1,10];
    let xScale = d3[meta.scale || 'scaleLinear']()
    let active = meta.hasOwnProperty('active') ? meta.active : meta.hasOwnProperty('preload') ? meta.preload : false
    xScale.domain(range)
    xScale.range([0,400])
    let obj = {
      meta,
      xScale,
      range,
      active
    }
    return obj
  }
);

const requestRawData = createAction('REQUEST_RAW_DATA')
const receiveRawData = createAction('RECEIVE_RAW_DATA')
const useStoredRawData = createAction('USE_STORED_RAW_DATA')

export const rawData = handleActions(
  {
    REQUEST_RAW_DATA: (state, action) => (
      state
    ),
    RECEIVE_RAW_DATA: (state, action) => (
      immutableUpdate(state, {
        byId: { [action.payload.id]: action.payload.json },
        allIds: [...state.allIds, action.payload.id]
      })
    ),
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
     if (json && json.values){
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

const getFieldRawData = (state, props) => {
  let id = props.fieldId
  const fieldRawDataById = deep(state,['rawData','byId',id]) || {}
  return fieldRawDataById
}

export const makeGetFieldRawData = () => createSelector(
  [ getFieldRawData ],
  (data) => data
)

const createRawDataSelectorForFieldId = createSelectorCreator((resultFunc) => {
  const memoAll = {};
  return (fieldId, ...args) => {
    if (!memoAll[fieldId]) {
      memoAll[fieldId] = {};
    }
    const memo = memoAll[fieldId];
    if (!shallow(memo.lastArgs, args)) {
      memo.lastArgs = args;
      memo.lastResult = resultFunc(...args);
    }
    return memo.lastResult;
  };
});

const getRawDataForField = (state, fieldId) => state.rawData.byId[fieldId];

export const getRawDataForFieldId = createRawDataSelectorForFieldId(
  _getFieldIdAsMemoKey,
  getRawDataForField,
  (rawData = {}) => {
    return rawData
  }
);

export const fieldReducers = {
  fields,
  rawData,
  topLevelFields
}
