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
    for (let i = 0; i < count; i++){
      list.push(i)
    }
    state.filters.allIds.forEach(id => {
      if (filters[id] && filters[id].type == 'selection'){
        list == filters[id].list
      }
      if (fields[id] && fields[id].active && filters[id]){
        if (filters[id].type == 'range'){
          let range = filters[id].range
          let limit = fields[id].range
          if (!shallow(range,limit)){
            list = filterRangeToList(range[0],range[1],data[id].values,list)
          }
        }
        else if (filters[id].type == 'list'){
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
