import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import { byIdSelectorCreator,
  handleSimpleByDatasetAction,
  getSimpleByDatasetProperty } from './selectorCreators'
import immutableUpdate from 'immutable-update';
import deep from 'deep-get-set'
import store from '../store'
import { getQueryValue } from './history'
import { editField } from './field'

export const editPlot = createAction('EDIT_PLOT')
const defaultPlot = () => {
  let x = getQueryValue('xField') || 'gc'
  let y = getQueryValue('yField') || 'cov0_cov'
  let z = getQueryValue('zField') || 'length'
  return {
    x,
    y,
    z,
    cat:'bestsumorder_phylum'
  }
}
export const plot = handleAction(
  'EDIT_PLOT',
  (state, action) => {
    let fields = Object.keys(action.payload).filter((key)=>{return key != 'id'})
    return immutableUpdate(state,
      Object.assign(...fields.map(f => ({[f]: action.payload[f]})))
    )
  },
  defaultPlot()
)
export const getPlot = state => state.plot

export const getMainPlot = createSelector(
  getPlot,
  axes => ({id:'default',axes})
)

export const plotReducers = {
  plot
}
