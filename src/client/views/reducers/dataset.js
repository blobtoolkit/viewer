import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector, createSelectorCreator } from 'reselect'
import immutableUpdate from 'immutable-update';
import deep from 'deep-get-set'
import shallow from 'shallowequal'
import store from '../store'

export const getSelectedDatasetMeta = state => {
  let meta = {}
  let id = state.selectedDataset || false
  if (id){
    meta = deep(state,['availableDatasets','byId',id])
  }
  return meta
}
