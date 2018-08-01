import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector, createSelectorCreator } from 'reselect'
import { getDatasetID } from './location'
import immutableUpdate from 'immutable-update';
import deep from 'deep-get-set'
import shallow from 'shallowequal'
import store from '../store'

export const getDatasetMetaById = (state,id) => deep(state,['availableDatasets','byId',id])

export const getSelectedDatasetMeta = createSelector(
  state => getDatasetMetaById(state,getDatasetID(state)),
  (meta) => {
    return meta || {}
  }
)

export const getDatasetById = (state,id) => deep(state,['datasets','byId',id])
export const getDataset = createSelector(
  state => getDatasetById(state,getDatasetID(state)),
  (dataset) => {
    return dataset || {}
  }
)
