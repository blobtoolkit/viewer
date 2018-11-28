import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import { byIdSelectorCreator } from './selectorCreators'
import immutableUpdate from 'immutable-update';
import deep from 'deep-get-set'
import store from '../store'
import { getQueryValue } from './location'
import { qsDefault } from '../querySync'
import { getDatasetMeta } from '../reducers/repository'

export const editPlot = createAction('EDIT_PLOT')
const defaultPlot = () => {
  return {}
}
export const plot = handleAction(
  'EDIT_PLOT',
  (state, action) => {
    let fields = Object.keys(action.payload).filter((key)=>{return key != 'id'})
    if (!fields) return {}
    return immutableUpdate(state,
      Object.assign(...fields.map(f => ({[f]: action.payload[f]})))
    )
  },
  {}
)
export const getPlot = state => state.plot

export const getMainPlot = createSelector(
  getPlot,
  axes => ({id:'default',axes})
)

export const getXAxis = createSelector(
  (state) => getMainPlot(state).axes.x,
  axis => axis
)

export const getYAxis = createSelector(
  (state) => getMainPlot(state).axes.y,
  axis => axis
)

export const getZAxis = createSelector(
  (state) => getMainPlot(state).axes.z,
  axis => axis
)

export const getCatAxis = createSelector(
  (state) => getMainPlot(state).axes.cat,
  axis => axis
)

export const plotReducers = {
  plot
}
