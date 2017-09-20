import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import { byIdSelectorCreator } from './selectorCreators'
import { getMainPlot } from './plot';


export const setPlotShape = createAction('SET_PLOT_SHAPE')
export const plotShape = handleAction(
  'SET_PLOT_SHAPE',
  (state, action) => {
    return action.payload
  },
  'hex'
)
export const getPlotShape = state => state.plotShape

export const setPlotResolution = createAction('SET_PLOT_RESOLUTION')
export const plotResolution = handleAction(
  'SET_PLOT_RESOLUTION',
  (state, action) => {
    return action.payload
  },
  15
)
export const getPlotResolution = state => state.plotResolution

export const setPlotGraphics = createAction('SET_PLOT_GRAPHICS')
export const plotGraphics = handleAction(
  'SET_PLOT_GRAPHICS',
  (state, action) => {
    return action.payload
  },
  'svg'
)
export const getPlotGraphics = state => state.plotGraphics

export const setPlotScale = createAction('SET_PLOT_SCALE')
export const plotScale = handleAction(
  'SET_PLOT_SCALE',
  (state, action) => {
    return action.payload
  },
  1
)
export const getPlotScale = state => state.plotScale

export const setZScale = createAction('SET_Z_SCALE')
export const zScale = handleAction(
  'SET_Z_SCALE',
  (state, action) => {
    return action.payload
  },
  'scaleLog'
)
export const getZScale = state => state.zScale

export const setZReducer = createAction('SET_Z_REDUCER')
export const zReducer = handleAction(
  'SET_Z_REDUCER',
  (state, action) => {
    return action.payload
  },
  (a,b) => (a+b)
)
export const getZReducer = state => state.zReducer


export const plotParameterReducers = {
  plotShape,
  plotResolution,
  plotGraphics,
  plotScale,
  zScale,
  zReducer
}
