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
import { addRecords, selectNone, getSelectedRecordsAsObject } from './select'


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
