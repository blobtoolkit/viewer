import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import { byIdSelectorCreator,
  getSimpleByDatasetProperty,
  getSelectedDatasetId } from './selectorCreators'
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
      let current = state.byDataset[getSelectedDatasetId()] || []
      console.log(current)
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
    CLEAR_SELECTION: (state, action) => {
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
  (arr) => {
    let obj = {}
    arr.forEach(id=>{
      obj[id] = 1
    })
    return obj
  }
)

export const selectReducers = {
  selectedRecords
}
