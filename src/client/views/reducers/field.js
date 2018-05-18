import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import { byIdSelectorCreator,
  handleSimpleByDatasetAction,
  getSimpleByDatasetProperty } from './selectorCreators'
import immutableUpdate from 'immutable-update';
import deep from 'deep-get-set'
import store from '../store'
import { getSelectedDatasetMeta } from './dataset'
import { addFilter, editFilter } from './filter'
import { getDimensionsbyDimensionId, setDimension } from './dimension'
import * as d3 from 'd3'
import { queryValue } from './history'

const apiUrl = window.apiURL || '/api/v1'

export const addTopLevelFields = createAction('ADD_TOP_LEVEL_FIELDS')
export const topLevelFields = handleAction(
  'ADD_TOP_LEVEL_FIELDS',
  (state, action) => (
    action.payload
  ),
  []
)
export const getTopLevelFields = state => state.topLevelFields


const addField = createAction('ADD_FIELD')
export const editField = createAction('EDIT_FIELD')
//export const cloneField = createAction('CLONE_FIELD')
const addFields = createAction('ADD_FIELDS')
const replaceFields = createAction('REPLACE_FIELDS')
const clearFields = createAction('CLEAR_FIELDS')

function isNumeric(n) {
  if ((typeof n === 'undefined') || n == 'NaN') return false
  return !isNaN(parseFloat(n)) && isFinite(n)
}

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
      if (action.payload.range){
        let current = state.byId[id].range.slice()
        action.payload.range[0] = isNumeric(action.payload.range[0]) ? action.payload.range[0] : current[0]
        action.payload.range[1] = isNumeric(action.payload.range[1]) ? action.payload.range[1] : current[1]
      }
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

function variableRawDataToCategory (data,meta){
  let x = d3[meta.scale || 'scaleLinear']().domain(meta.range)
  x.range([0,10])
  // let quantile = d3.scaleQuantile()
  //  .domain(data.values.sort())
  //  .range([0,10]);
  let sorted = data.values.slice(0).sort((a,b)=>a - b)
  // let keys = Array.from(Array(9).keys()).map((n)=>{return x.invert((n+1))});
  let keys = Array.from(Array(10).keys()).map((n)=>{return d3.quantile(sorted,(n+1)/10)});
  // keys.push(meta.range[1])
  let step = keys[1] - keys[0]
  let len = data.values.length
  let values = []
  for (let i = 0; i < len; i++){
    for (let b = keys.length -1; b >= 0; b--){
      if (data.values[i] > keys[b]){
        values[i] = b + 1
        b = -1
      }
      else if (b == 0){
        values[i] = 0
      }
    }
    //values[i] = Math.floor(data.values[i]/step - keys[0]/step + 1)
  }
  return {keys,values,fixedOrder:true}
}

export function cloneField(obj) {
  return dispatch => {
    let state = store.getState()
    let id = obj.id
    let new_id = id + '_1'
    let linked_id = obj.id
    let parent_id = 'userDefined'
    let field = Object.keys(state.fields.byId[linked_id])
        .filter((key)=>{return key != 'id'})
        .reduce((obj, key) => {
          obj[key] = state.fields.byId[linked_id][key];
          return obj;
        }, {});
    field.id = new_id
    field.clonedFrom = obj.id
    field.type = "category"
    dispatch(addField(field))
    let child = {id: new_id, name: new_id, active: false}
    let children = state.fields.byId[parent_id].children.concat(child)
    dispatch(editField({id:parent_id,children}))
    let raw_data = state.rawData.byId[linked_id]
    let converted_data = variableRawDataToCategory(raw_data,field)
    dispatch(receiveRawData({id:new_id,json:converted_data}))
    let filt = Object.keys(state.filters.byId[linked_id])
        .filter((key)=>{return key != 'id'})
        .reduce((obj, key) => {
          obj[key] = state.filters.byId[linked_id][key];
          return obj;
        }, {});
    filt.id = new_id
    filt.type = 'list'
    filt.keys = converted_data.keys.slice(0)
    filt.toggled = Array.from(Array(10).keys()).map(i=>false)
    dispatch(addFilter(filt))

    // dispatch(requestRawData(id))
    // let json = deep(state,['rawData','byId',linkIdToDataset(id)]);
    // if (json && json.values){
    //   dispatch(useStoredRawData(json))
    //   return Promise.resolve(useStoredRawData(json));
    // }
    // let datasetId = deep(state,['selectedDataset']);
    // return fetch(`http://localhost:8000/api/v1/field/${datasetId}/${id}`)
    //   .then(
    //     response => response.json(),
    //     error => console.log('An error occured.', error)
    //   )
    //   .then(json => {
    //     if (!json.keys || json.keys.length == 0){
    //       let meta = getDetailsForFieldId(state,id)
    //       let max = Number.MIN_VALUE, min = Number.MAX_VALUE;
    //       let len = json.values.length;
    //       for (let i = 0; i < len; i++) {
    //         if (json.values[i] > max) max = json.values[i];
    //         if (json.values[i] < min) min = json.values[i];
    //       }
    //       if (min == 0) min = 0.01
    //       let scale = meta.xScale.copy().domain([min,max]).nice(25)
    //       dispatch(editField({id,range:scale.domain()}))
    //       dispatch(editFilter({id,range:scale.domain(),limit:scale.domain()}))
    //     }
    //     dispatch(receiveRawData({id,json}))
    //   })
   }
}

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
const createSelectorForFieldId = byIdSelectorCreator();

const _getFieldIdAsMemoKey = (state, fieldId) => fieldId;
export const getMetaDataForField = (state, fieldId) => state.fields ? state.fields.byId[fieldId] : {};

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
    obj.type = meta.type
    obj.clonedFrom = meta.clonedFrom
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
    let state = store.getState()
    dispatch(requestRawData(id))
    let json = deep(state,['rawData','byId',id]);
    if (json && json.values){
      dispatch(useStoredRawData(json))
      return Promise.resolve(useStoredRawData(json));
    }
    let datasetId = deep(state,['selectedDataset']);
    return fetch(`${apiUrl}/field/${datasetId}/${id}`)
      .then(
        response => response.json(),
        error => console.log('An error occured.', error)
      )
      .then(json => {
        if (!json.keys || json.keys.length == 0){
          let meta = getDetailsForFieldId(state,id)
          let max = Number.MIN_VALUE, min = Number.MAX_VALUE;
          let len = json.values.length;
          for (let i = 0; i < len; i++) {
            if (json.values[i] > max) max = json.values[i];
            if (json.values[i] < min) min = json.values[i];
          }
          // if (min == 0) min = 0.001
          let scale = meta.xScale.copy().domain([min,max]).nice(25)
          let limit = scale.domain().slice(0)
          limit[0] = 1*queryValue(id+'--LimitMin') || limit[0]
          limit[1] = 1*queryValue(id+'--LimitMax') || limit[1]
          dispatch(editField({id,range:limit}))
          let range = scale.domain().slice(0)
          range[0] = 1*queryValue(id+'--Min') || range[0]
          range[1] = 1*queryValue(id+'--Max') || range[1]
          let invert = queryValue(id+'--Inv') || false
          dispatch(editFilter({id,range,invert,limit:scale.domain()}))
        }
        else {
          let keystr = queryValue(id+'--Keys') || ''
          let keys = keystr.split(',').filter(Boolean).map(Number)
          let invert = queryValue(id+'--Inv') || false
          dispatch(editFilter({id,keys,invert}))
        }
        dispatch(receiveRawData({id,json}))
      })
   }
}

export const addAllFields = (dispatch,fields,flag,meta) => {
  if (flag) {
    dispatch(clearFields)
    dispatch(addTopLevelFields(fields))
  }
  dispatch(addField({
    id:'selection',
    type:'selection',
    children:[]
  }))
  dispatch(addFilter({
    id:'selection',
    type:'selection',
    list:[],
    invert:false
  }))
  dispatch(receiveRawData({id:'selection',json:{values:[]}}))
  dispatch(addField({
    id:'userDefined',
    children:[{id:'selection',active:false}]
  }))
  fields.forEach(field => {
    if (meta){
      Object.keys(meta).forEach(key => {
        if (key != 'children' && key != 'data' && !field.hasOwnProperty(key)){
          field[key] = meta[key];
        }
      })
    }
    dispatch(addField(field))
    if (field.children){
      addAllFields(dispatch,field.children,false,field)
    }
    else {
      if (field.type == 'variable'){
        let range = field.range.slice(0)
        let minstr = queryValue('min'+field.id)
        minstr = minstr ? Number(minstr) : null
        let maxstr = queryValue('max'+field.id)
        maxstr = maxstr ? Number(maxstr) : null
        // let invert = queryValue('inv'+field.id) == 'true'
        range = [minstr || range[0],maxstr || range[1]]
        dispatch(addFilter({id:field.id,type:'range',range:field.range.slice(0)}))
      }
      if (field.type == 'category'){
        dispatch(addFilter({
          id:field.id,
          type:'category',
          toggled:Array.from(Array(10).keys()).map(i=>false),
          keys:[]
        }))
      }
      if (field.preload == true){
        dispatch(fetchRawData(field.id))
      }
    }
    if (field.data){
      addAllFields(dispatch,field.data,false,field)
    }
  })
}


export const getFieldsByParent = (state,id) => deep(state,['fields','byId',id,'children']) || []
export const getFieldsByOwner = (state,id) => deep(state,['fields','byId',id,'data']) || []
export const getFields = (state,id) => state.fields.byId || []

export const getFieldHierarchy = createSelector(
  getTopLevelFields,
  getFields,
  (list, fields) => {
    function processFields(list,fields) {
      let hierarchy = []
      list.forEach((field) => {
          let id = field.id
          if (!fields[id] || (fields[id].type != 'variable' &&
              fields[id].type != 'category' &&
              fields[id].id != 'userDefined' &&
              fields[id].type != 'selection')){
                return hierarchy
              }
          let base_id = id//id.replace(/^\w+?_/,'')
          let obj = {id:base_id,hasRecords:true};
          if (fields[id].hasOwnProperty('children')){
            obj.hasRecords = false
          }
          let children = (fields[id].children || []).concat(fields[id].data || [])
          if (children.length > 0){
            obj.children = processFields(children,fields)
          }
          hierarchy.push(obj)
      })
      return hierarchy
    }
    let hierarchy = processFields(list,fields)
    return hierarchy
  }
)

// const getFieldRawData = (state, props) => {
//   let id = props.fieldId
//   const fieldRawDataById = deep(state,['rawData','byId',id]) || {}
//   return fieldRawDataById
// }
//
// export const makeGetFieldRawData = () => createSelector(
//   [ getFieldRawData ],
//   (data) => data
// )

const createRawDataSelectorForFieldId = byIdSelectorCreator();

const getRawDataForField = (state, fieldId) => state.rawData ? state.rawData.byId[fieldId] : {};

export const getRawDataForFieldId = createRawDataSelectorForFieldId(
  _getFieldIdAsMemoKey,
  getRawDataForField,
  (rawData) => {
    return rawData
  }
);


const createBinSelectorForFieldId = byIdSelectorCreator();


export const getBinsForFieldId = createBinSelectorForFieldId(
  _getFieldIdAsMemoKey,
  getRawDataForFieldId,
  getDetailsForFieldId,
  (rawData = {}, details = {}) => {
    let data = rawData.values || []
    let keys = rawData.keys || {}
    let bins = []
    if (data){
      if (details.meta.type == 'variable'){
        let x = details.xScale
        x.range([0,25])
        let thresh = Array.from(Array(24).keys()).map((n)=>{return x.invert((n+1))});
        bins = d3.histogram()
            .domain(x.domain())
            .thresholds(thresh)
            (data);
      }
      if (details.meta.type == 'category'){
        let nested = d3.nest()
          .key(d => d)
          .rollup(d => d.length)
          .entries(data)
        let sorted = []
        if (!rawData.fixedOrder){
          let order = queryValue('sortOrder') || ''
          order = order.split(',')
          let sortFunction = (a,b) => {
            let ia = order.indexOf(keys[a.key])
            let ib = order.indexOf(keys[b.key])
            if (ia >= 0 && ib >= 0){
              return ia - ib
            }
            else if (ia >= 0){
              return -1
            }
            else if (ib >= 0){
              return 1
            }
            return b.value - a.value
          }
          sorted = nested.sort(sortFunction);
          // sorted = nested.sort((a,b) => b.value - a.value);
        }
        else {
          sorted = nested.sort((a,b) => a.key - b.key);
        }
        if (sorted.length > 10){
          let count = sorted.slice(9).map(o=>o.value).reduce((a,b)=>a+b)
          let index = sorted.slice(9).map(o=>o.key*1)
          sorted = sorted.slice(0,9).concat({key:'other',value:count,index:index})
        }
        bins = sorted.map((d,i) => ({
          id:rawData.keys[d.key] || 'other',
          keys:d.index || [d.key*1],
          x0:i,
          x1:i+1,
          length:d.value
        }))
      }
    }
    return bins
  }
);

const createBarSelectorForFieldId = byIdSelectorCreator();

export const getBarsForFieldId = createBarSelectorForFieldId(
  _getFieldIdAsMemoKey,
  getBinsForFieldId,
  getDetailsForFieldId,
  (state) => getDimensionsbyDimensionId(state,'preview'),
  (bins, details, dimensions) => {
    let bars = []
    let x = details.xScale
    let y = d3.scaleLinear()
          .domain([0, d3.max(bins, function(d) { return d.length; })])
          .range([dimensions.height, 0]);
    if (details.meta.type == 'category'){
      x = d3.scaleLinear()
      x.domain([0,10]);
      y = d3.scaleSqrt()
            .domain([0, d3.max(bins, function(d) { return d.length; })])
            .range([dimensions.height, 0]);
    }
    x.range([0,dimensions.width])
    bins.forEach((d,i)=>{
      bars.push({
        id:d.id || i,
        x:x(d.x0),
        y:y(d.length),
        width:x(d.x1) - x(d.x0) -1,
        height:(dimensions.height - y(d.length)) || 0
      })
    })
    return bars
  }
);


export const fieldReducers = {
  fields,
  rawData,
  topLevelFields
}
