import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import { byIdSelectorCreator,
  handleSimpleByDatasetAction,
  getSimpleByDatasetProperty,
  getSelectedDatasetId,
  linkIdToDataset } from './selectorCreators'
import immutableUpdate from 'immutable-update';
import deep from 'deep-get-set'
import shallow from 'shallowequal'
import store from '../store'
import { queryValue, addQueryValues, removeQueryValues } from '../History'

export const addFilter = createAction('ADD_FILTER')
export const editFilter = createAction('EDIT_FILTER')

function isNumeric(n) {
  if ((typeof n === 'undefined') || n == 'NaN') return false
  return !isNaN(parseFloat(n)) && isFinite(n)
}

export const filters = handleActions(
  {
    ADD_FILTER: (state, action) => (
      immutableUpdate(state, {
        byId: { [linkIdToDataset(action.payload.id)]: action.payload },
        allIds: [...state.allIds, linkIdToDataset(action.payload.id)]
      })
    ),
    EDIT_FILTER: (state, action) => {
      // immutableUpdate(state, {
      //   byId: { [action.payload.id]: action.payload }
      // })
      let id = linkIdToDataset(action.payload.id)
      let fields = Object.keys(action.payload).filter((key)=>{return key != 'id'})
      if (action.payload.range){
        let range = []
        range[0] = isNumeric(action.payload.range[0]) ? action.payload.range[0] : Number.NEGATIVE_INFINITY
        range[1] = isNumeric(action.payload.range[1]) ? action.payload.range[1] : Number.POSITIVE_INFINITY
        let limit = action.payload.limit || state.byId[id].limit.slice()
        action.payload.range[0] = Math.max(range[0],limit[0])
        action.payload.range[1] = Math.min(range[1],limit[1])
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


export const updateFilterList = createAction('UPDATE_FILTER_LIST')
export const filteredList = handleSimpleByDatasetAction('UPDATE_FILTER_LIST')
const createSelectorForFilteredList = byIdSelectorCreator();
export const getFilteredList = createSelectorForFilteredList(
  getSelectedDatasetId,
  getSimpleByDatasetProperty('filteredList'),
  list => list || []
)

const filterRangeToList = (low,high,arr,list,invert) => {
  let ret = []
  let len = list.length
  for (var i = 0; i < len; i++){
    if (invert){
      if (arr[list[i]] < low || arr[list[i]] > high){
        ret.push(list[i]);
      }
    }
    else {
      if (arr[list[i]] >= low && arr[list[i]] <= high){
        ret.push(list[i]);
      }
    }
  }
  return ret
}

const filterCategoriesToList = (keys,arr,list,invert) => {
  let ret = []
  let len = list.length
  for (var i = 0; i < len; i++){
    if (invert){
      if (keys.includes(arr[list[i]])){
        ret.push(list[i]);
      }
    }
    else {
      if (!keys.includes(arr[list[i]])){
        ret.push(list[i]);
      }
    }

  }
  return ret
}

const filterArrayToList = (arr,list) => {
  let ret = []
  let a=0, l=0;
  while (a < arr.length && l < list.length){
    if (arr[a] < list[l] ){
      a++
    }
    else if (arr[a] > list[l]){
      l++
    }
    else {
      ret.push(arr[a])
      a++
      l++
    }
  }
  return ret
}

const filterArrayFromList = (arr,list) => {
  let ret = []
  let a=0, l=0;
  while (a < arr.length && l < list.length){
    if (arr[a] < list[l] ){
      a++
    }
    else if (arr[a] > list[l]){
      ret.push(list[l])
      l++
    }
    else {
      a++
      l++
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
    let list = fields[linkIdToDataset('selection')].active ? state.selectedRecords.byDataset[state.selectedDataset] : undefined
    let all = []
    if (!list || list.length == 0 || filters[linkIdToDataset('selection')].invert){
      for (let i = 0; i < count; i++){
        all.push(i)
      }
    }
    if (!list || list.length == 0){
      list = all
    }
    else if (fields[linkIdToDataset('selection')].active && filters[linkIdToDataset('selection')].invert){
      list = filterArrayFromList(list,all)
    }
    state.filters.allIds.forEach(id => {
      if (fields[id] && fields[id].active && filters[id]){
        if (filters[id].type == 'range'){
          let range = filters[id].range
          let limit = fields[id].range
          if (!shallow(range,limit)){
            list = filterRangeToList(range[0],range[1],data[id].values,list,filters[id].invert)
            let values = {}
            let localID = id.replace(/^[^_]+_/,'')
            let minstr = 'min'+localID
            let maxstr = 'max'+localID
            let invstr = 'inv'+localID
            let qmin = queryValue(minstr)
            let qmax = queryValue(maxstr)
            if (range[0] > limit[0] || qmin){
              values[minstr] = range[0]
            }
            if (range[1] < limit[1] || qmax){
              values[maxstr] = range[1]
            }
            if (filters[id].invert){
              values[invstr] = true
            }
            else if (queryValue(invstr)){
              values[invstr] = false
            }
            addQueryValues(values)
          }
        }
        else if (filters[id].type == 'list' || filters[id].type == 'category'){
          //let data_id = filters[id].clonedFrom || id
          if (data[id]){
            list = filterCategoriesToList(filters[id].keys,data[id].values,list,filters[id].invert)
            let localID = id.replace(/^[^_]+_/,'')
            let keystr = 'keys'+localID
            let invstr = 'inv'+localID
            if (filters[id].keys.length > 0){
              let values = {}
              values[keystr] = filters[id].keys.join()
              if (filters[id].invert){
                values[invstr] = true
              }
              else {
                values[invstr] = false
              }
              addQueryValues(values)
            }
            else {
              removeQueryValues([keystr,invstr])
            }
          }
          //console.log(data_id)
        }
        // else if (filters[id].type == 'selection'){
        //   list = filterArrayToList(filters[id].list,list)
        // }
      }
    })
    dispatch(updateFilterList(list))
  }
}

export const filterReducers = {
  filters,
  filteredList
}
