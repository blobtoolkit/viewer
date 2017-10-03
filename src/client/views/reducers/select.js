import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import { byIdSelectorCreator } from './selectorCreators'
import { getFilteredList } from './filter'
import immutableUpdate from 'immutable-update';
import deep from 'deep-get-set'
import store from '../store'


export const addRecords = createAction('ADD_RECORDS')
export const removeRecords = createAction('REMOVE_RECORDS')
export const clearSelection = createAction('CLEAR_SELECTION')

export const selectedRecords = handleActions(
  {
    ADD_RECORDS: (state, action) => {
      let iLen = state.length
      let jLen = action.payload.length
      let combined = []
      let i = 0
      let j = 0
      while (i < iLen && j < jLen) {
        if (state[i] < action.payload[j]){
          combined.push(state[i])
          i++
        }
        else if (action.payload[j] < state[i]){
          combined.push(action.payload[j])
          j++
        }
        else {
          combined.push(state[i])
          i++
          j++
        }
      }
      while (i < iLen){
        combined.push(state[i])
        i++
      }
      while (j < jLen){
        combined.push(action.payload[j])
        j++
      }
      return combined
    },
    REMOVE_RECORDS: (state, action) => {
      let arr = []
      let iLen = state.length
      let jLen = action.payload.length
      let i = 0
      let j = 0
      while (i < iLen && j < jLen) {
        if (state[i] < action.payload[j]){
          arr.push(state[i])
          i++
        }
        else if (action.payload[j] < state[i]){
          j++
        }
        else {
          i++
          j++
        }
      }
      while (i < iLen){
        arr.push(state[i])
        i++
      }
      return arr
    },
    CLEAR_SELECTION: (state, action) => (
      []
    )
  },
  []
)

export const getSelectedRecords = state => state.selectedRecords

export const getSelectedRecordsAsArray = createSelector(
  getFilteredList,
  getSelectedRecords,
  (list,records) => {
    return records
  }
)
export const getSelectedRecordsAsObject = createSelector(
  getSelectedRecordsAsArray,
  (arr) => {
    let obj = {}
    arr.forEach(id=>{
      obj[id] = 1
    })
    return obj
  }
)

export function addRecordsToSelectedList(arr) {
  return function(dispatch){
    let state = store.getState();
    let list = state.filteredList;
    let len = arr.length
    let newArr = []
    for (let i = 0; i < len; i++){
      newArr.push(list[arr[i]])
    }
    dispatch(addRecords(newArr))
  }
}

export const selectReducers = {
  selectedRecords
}
