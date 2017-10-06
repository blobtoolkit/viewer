import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector, createSelectorCreator } from 'reselect'
import immutableUpdate from 'immutable-update';
import deep from 'deep-get-set'
import shallow from 'shallowequal'
import store from '../store'

export const getSelectedDataset = state => state.selectedDataset || false
export const getDatasetMetaById = (state,id) => deep(state,['availableDatasets','byId',id])
export const getSelectedDatasetMeta = createSelector(
  state => getDatasetMetaById(state,getSelectedDataset(state)),
  (meta) => meta || {}
)
