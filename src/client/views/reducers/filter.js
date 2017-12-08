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


export const addFilter = createAction('ADD_FILTER')
export const editFilter = createAction('EDIT_FILTER')

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
        let limit = action.payload.limit || state.byId[id].limit.slice()
        action.payload.range[0] = Math.max(action.payload.range[0],limit[0])
        action.payload.range[1] = Math.min(action.payload.range[1],limit[1])
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
  console.log(keys)
  console.log(arr)
  console.log(list)
  console.log(invert)
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
    let list = state.selectedRecords.byDataset[state.selectedDataset]
    let all = []
    if (!list || filters[linkIdToDataset('selection')].invert){
      for (let i = 0; i < count; i++){
        all.push(i)
      }
    }
    if (!list){
      list = all
    }
    else if (filters[linkIdToDataset('selection')].invert){
      list = filterArrayFromList(list,all)
    }
    state.filters.allIds.forEach(id => {
      if (fields[id] && fields[id].active && filters[id]){
        if (filters[id].type == 'range'){
          let range = filters[id].range
          let limit = fields[id].range
          if (!shallow(range,limit)){
            list = filterRangeToList(range[0],range[1],data[id].values,list,filters[id].invert)
          }
        }
        else if (filters[id].type == 'list' || filters[id].type == 'category'){
          //let data_id = filters[id].clonedFrom || id

            console.log(filters[id])
          list = filterCategoriesToList(filters[id].keys,data[id].values,list,filters[id].invert)
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
