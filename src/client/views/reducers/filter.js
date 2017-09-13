import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
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
        byId: { [action.payload.id]: action.payload },
        allIds: [...state.allIds, action.payload.id]
      })
    ),
    EDIT_FILTER: (state, action) => {
      // immutableUpdate(state, {
      //   byId: { [action.payload.id]: action.payload }
      // })
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

const filterCategoriesToList = (keys,arr,list) => {
  let ret = []
  let len = list.length
  for (var i = 0; i < len; i++){
    if (!keys.includes(arr[list[i]])){
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
        if (filters[id].range){
          let range = filters[id].range
          let limit = fields[id].range
          if (!shallow(range,limit)){
            list = filterRangeToList(range[0],range[1],data[id].values,list)
          }
        }
        else if (filters[id].keys && filters[id].keys.length > 0){
          list = filterCategoriesToList(filters[id].keys,data[id].values,list)
        }
      }
    })
    dispatch(updateFilterList(list))
  }
}

export const filterReducers = {
  filters,
  filteredList
}
