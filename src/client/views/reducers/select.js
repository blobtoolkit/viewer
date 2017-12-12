import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import { byIdSelectorCreator,
  getSimpleByDatasetProperty,
  getSelectedDatasetId } from './selectorCreators'
import { getFilteredList } from './filter'
import { getDatasetMeta } from './repository'
import immutableUpdate from 'immutable-update';
import deep from 'deep-get-set'
import store from '../store'


export const toggleSelection = createAction('TOGGLE_SELECTION')
const selectionDisplay = handleActions(
  {
    TOGGLE_SELECTION: (state, action) => {
      return immutableUpdate(state, {
        byDataset: { [getSelectedDatasetId()]: !action.payload }
      })
    }
  },
  {byDataset:{}}
)

const createSelectorForSelectionDisplay = byIdSelectorCreator();
export const getSelectionDisplay = createSelectorForSelectionDisplay(
  getSelectedDatasetId,
  getSimpleByDatasetProperty('selectionDisplay'),
  value => typeof(value) != "undefined" ? value : true
)

export const addRecords = createAction('ADD_RECORDS')
export const removeRecords = createAction('REMOVE_RECORDS')
export const selectNone = createAction('SELECT_NONE')

export const selectedRecords = handleActions(
  {
    ADD_RECORDS: (state, action) => {
      let current = state.byDataset[getSelectedDatasetId()] || []
      let iLen = current.length
      let jLen = action.payload.length
      let combined = []
      let i = 0
      let j = 0
      while (i < iLen && j < jLen) {
        if (current[i] < action.payload[j]){
          combined.push(current[i])
          i++
        }
        else if (action.payload[j] < current[i]){
          combined.push(action.payload[j])
          j++
        }
        else {
          combined.push(current[i])
          i++
          j++
        }
      }
      while (i < iLen){
        combined.push(current[i])
        i++
      }
      while (j < jLen){
        combined.push(action.payload[j])
        j++
      }
      return immutableUpdate(state, {
        byDataset: { [getSelectedDatasetId()]: combined }
      })
    },
    REMOVE_RECORDS: (state, action) => {
      let current = state.byDataset[getSelectedDatasetId()] || []
      let arr = []
      let iLen = current.length
      let jLen = action.payload.length
      let i = 0
      let j = 0
      while (i < iLen && j < jLen) {
        if (current[i] < action.payload[j]){
          arr.push(current[i])
          i++
        }
        else if (action.payload[j] < current[i]){
          j++
        }
        else {
          i++
          j++
        }
      }
      while (i < iLen){
        arr.push(current[i])
        i++
      }
      return immutableUpdate(state, {
        byDataset: { [getSelectedDatasetId()]: arr }
      })
    },
    SELECT_NONE: (state, action) => {
      return immutableUpdate(state, {
        byDataset: { [getSelectedDatasetId()]: [] }
      })
    }
  },
  {byDataset:{}}
)

const createSelectorForSelectedRecords = byIdSelectorCreator();
export const getSelectedRecords = createSelectorForSelectedRecords(
  getSelectedDatasetId,
  getSimpleByDatasetProperty('selectedRecords'),
  arr => arr || []
)

export const getSelectedRecordsAsObject = createSelector(
  getSelectedRecords,
  getSelectionDisplay,
  (arr,display) => {
    let obj = {}
    if (!display) return obj
    arr.forEach(id=>{
      obj[id] = 1
    })
    return obj
  }
)

export function selectAll() {
  return dispatch => {
    let state = store.getState()
    let meta = getDatasetMeta(state,getSelectedDatasetId())
    let all = getFilteredList(state,getSelectedDatasetId())
    dispatch(addRecords(all))
  }
}

export function invertSelection() {
  return dispatch => {
    let state = store.getState()
    let meta = getDatasetMeta(state,getSelectedDatasetId())
    let all = getFilteredList(state,getSelectedDatasetId())
    let current = getSelectedRecordsAsObject(state,getSelectedDatasetId())
    let rev = []
    for (let i = 0; i < all.length; i++){
      if (!current[all[i]]){
        rev.push(all[i])
      }
    }
    dispatch(selectNone())
    dispatch(addRecords(rev))
  }
}

export function selectInverse() {
  return dispatch => {
    let state = store.getState()
    let meta = getDatasetMeta(state,getSelectedDatasetId())
    let all = []
    for (let i = 0; i < meta.records; i++){
      all.push(i)
    }
    dispatch(addRecords(all))
  }
}

export const selectReducers = {
  selectedRecords,
  selectionDisplay
}
