import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import { byIdSelectorCreator,
  handleSimpleByDatasetAction,
  getSimpleByDatasetProperty,
  getSelectedDatasetId } from './selectorCreators'
import { getMainPlot } from './plot';
import immutableUpdate from 'immutable-update';
import store from '../store'
import { queryValue } from '../History'

export const setPlotShape = createAction('SET_PLOT_SHAPE')
export const plotShape = handleSimpleByDatasetAction('SET_PLOT_SHAPE')
const createSelectorForPlotShape = byIdSelectorCreator();
export const getPlotShape = createSelectorForPlotShape(
  getSelectedDatasetId,
  getSimpleByDatasetProperty('plotShape'),
  (plotShape) => {
    return plotShape || queryValue('plotShape') || 'hex'
  }
);

export const setPlotResolution = createAction('SET_PLOT_RESOLUTION')
export const plotResolution = handleSimpleByDatasetAction('SET_PLOT_RESOLUTION')
const createSelectorForPlotResolution = byIdSelectorCreator();
export const getPlotResolution = createSelectorForPlotResolution(
  getSelectedDatasetId,
  getSimpleByDatasetProperty('plotResolution'),
  res => res || queryValue('plotResolution') || 30
)

// export const setPlotGraphics = createAction('SET_PLOT_GRAPHICS')
// export const plotGraphics = handleSimpleByDatasetAction('SET_PLOT_GRAPHICS')
// const createSelectorForPlotGraphics = byIdSelectorCreator();
// export const getPlotGraphics = createSelectorForPlotGraphics(
//   getSelectedDatasetId,
//   getSimpleByDatasetProperty('plotGraphics'),
//   graphics => graphics || 'svg'
// )

export const setPlotScale = createAction('SET_PLOT_SCALE')
export const plotScale = handleSimpleByDatasetAction('SET_PLOT_SCALE')
const createSelectorForPlotScale = byIdSelectorCreator();
export const getPlotScale = createSelectorForPlotScale(
  getSelectedDatasetId,
  getSimpleByDatasetProperty('plotScale'),
  scale => scale || queryValue('plotScale') || 1
)

export const setZScale = createAction('SET_Z_SCALE')
export const zScale = handleSimpleByDatasetAction('SET_Z_SCALE')
const createSelectorForZScale = byIdSelectorCreator();
export const getZScale = createSelectorForZScale(
  getSelectedDatasetId,
  getSimpleByDatasetProperty('zScale'),
  scale => scale || queryValue('zScale') || 'scaleLog'
)

export const setZReducer = createAction('SET_Z_REDUCER')
const zReducers = {
  sum: arr => {
      let sum = 0;
      let len = arr.length
      for (let i = 0; i < len; i++){
        sum += arr[i]
      }
      return sum
    },
  min: arr => {
      let min = Number.POSITIVE_INFINITY
      let len = arr.length
      for (let i = 0; i < len; i++){
        if (arr[i] < min) min = arr[i]
      }
      return min
    },
  max: arr => {
      let max = Number.NEGATIVE_INFINITY
      let len = arr.length
      for (let i = 0; i < len; i++){
        if (arr[i] > max) max = arr[i]
      }
      return max
    },
  count: arr => arr.length > 0 ? arr.length : 0,
  mean: arr => {
      if (!arr.length > 0) return 0
      let sum = 0;
      let len = arr.length
      for (let i = 0; i < len; i++){
        sum += arr[i]
      }
      return sum / arr.length
    }
}
export const zReducer = handleAction(
  'SET_Z_REDUCER',
  (state, action) => {
    if (zReducers[action.payload]){
      return immutableUpdate(state,
        {byDataset:{[getSelectedDatasetId()]:{id:action.payload,func:zReducers[action.payload]}}}
      )
    }
  },
  { byDataset:{} }
)
const createSelectorForZReducer = byIdSelectorCreator();
export const getZReducer = createSelectorForZReducer(
  getSelectedDatasetId,
  getSimpleByDatasetProperty('zReducer'),
  reducer => {
    if (!reducer){
      let qReducer = queryValue('zReducer')
      if (qReducer){
        reducer = {id:qReducer,func:zReducers[qReducer]}
      }
    }
    return reducer || {id:'sum',func:zReducers.sum}
  }
)

export const setTransformFunction = createAction('EDIT_Y_TRANSFORM')
export const transformFunction = handleAction(
  'EDIT_Y_TRANSFORM',
  (state, action) => {
    let obj = {}
    let dsId = getSelectedDatasetId()
    let current = state.byDataset[dsId] || { x:500, order:1, factor:0 }
    obj.x = action.payload.x ? action.payload.x * 1 : current.x
    obj.order = action.payload.order ? action.payload.order * 1 : current.order
    obj.factor = action.payload.factor ? action.payload.factor * 1 : current.factor
    return immutableUpdate(state,
      {byDataset:{[getSelectedDatasetId()]:obj}}
    )
  },
  { byDataset:{} }
)
const createSelectorForTransformFunction = byIdSelectorCreator();
export const getTransformFunctionParams = createSelectorForTransformFunction(
  getSelectedDatasetId,
  getSimpleByDatasetProperty('transformFunction'),
  params => params || { x:500, order:1, factor:0 }
)

export const getTransformFunction = createSelector(
  getTransformFunctionParams,
  (props) => {
  let factor = props.factor / 900
  return (([x,y]) => {
    let newY = y + ((Math.abs(props.x-x)**props.order) * (props.factor / 900**(props.order-1)))
    return [x,newY]
  })
})


export const plotParameterReducers = {
  plotShape,
  plotResolution,
  // plotGraphics,
  plotScale,
  zScale,
  zReducer,
  transformFunction
}
