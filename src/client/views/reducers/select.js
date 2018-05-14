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
const selectionDisplay = handleAction(
  'TOGGLE_SELECTION',
  (state, action) => (
    !action.payload
  ),
  true
)

const createSelectorForSelectionDisplay = byIdSelectorCreator();
export const getSelectionDisplay = state => state.selectionDisplay


export const addRecords = createAction('ADD_RECORDS')
export const removeRecords = createAction('REMOVE_RECORDS')
export const selectNone = createAction('SELECT_NONE')

export const selectedRecords = handleActions(
  {
    ADD_RECORDS: (state, action) => {
      let current = state || []
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
      return  combined
    },
    REMOVE_RECORDS: (state, action) => {
      let current = state
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
      return arr
    },
    SELECT_NONE: (state, action) => {
      return []
    }
  },
  []
)

export const getSelectedRecords = state => state.selectedRecords

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
    let meta = getDatasetMeta(state)
    let all = getFilteredList(state)
    dispatch(addRecords(all))
  }
}

export function invertSelection() {
  return dispatch => {
    let state = store.getState()
    let meta = getDatasetMeta(state)
    let all = getFilteredList(state)
    let current = getSelectedRecordsAsObject(state)
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
    let meta = getDatasetMeta(state)
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
