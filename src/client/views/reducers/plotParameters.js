import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import { byIdSelectorCreator,
  handleSimpleByDatasetAction,
  getSimpleByDatasetProperty } from './selectorCreators'
import { getMainPlot } from './plot';
import immutableUpdate from 'immutable-update';
import store from '../store'
import { queryValue } from './history'

export const setPlotShape = createAction('SET_PLOT_SHAPE')
export const plotShape = handleAction(
  'SET_PLOT_SHAPE',
  (state, action) => (
    action.payload
  ),
  'square'
)
export const getPlotShape = state => state.plotShape

export const setPlotResolution = createAction('SET_PLOT_RESOLUTION')
export const plotResolution = handleAction(
  'SET_PLOT_RESOLUTION',
  (state, action) => (
    action.payload
  ),
  30
)
export const getPlotResolution = state => state.plotResolution

export const setPlotScale = createAction('SET_PLOT_SCALE')
export const plotScale = handleAction(
  'SET_PLOT_SCALE',
  (state, action) => (
    action.payload
  ),
  1
)
export const getPlotScale = state => state.plotScale

export const setZScale = createAction('SET_Z_SCALE')
export const zScale = handleAction(
  'SET_Z_SCALE',
  (state, action) => (
    action.payload
  ),
  'scaleLog'
)
export const getZScale = state => state.zScale

export const setZReducer = createAction('SET_Z_REDUCER')
export const zReducers = {
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
    },
  n50: arr => {
      if (!arr.length > 0) return 0
      arr.sort((a,b)=>b-a);
      let len = arr.length
      let sum = 0
      for (let i = 0; i < len; i++){
        sum += arr[i]
      }
      let csum = 0
      for (let i = 0; i < len; i++){
        csum += arr[i]
        if (csum >= Math.floor(sum/2)){
          return (arr[i])
        }
      }
      return 0
    }
}
export const zReducer = handleAction(
  'SET_Z_REDUCER',
  (state, action) => (
    {id:action.payload,func:zReducers[action.payload]}
  ),
  {id:'sum',func:zReducers.sum}
)
export const getZReducer = state => state.zReducer


const defaultTransform = { x:500, order:1, factor:0 }
export const setTransformFunction = createAction('EDIT_Y_TRANSFORM')
export const transformFunction = handleAction(
  'EDIT_Y_TRANSFORM',
  (state, action) => {
    let obj = {}
    obj.x = action.payload.x ? action.payload.x * 1 : defaultTransform.x
    obj.order = action.payload.order ? action.payload.order * 1 : defaultTransform.order
    obj.factor = action.payload.factor ? action.payload.factor * 1 : defaultTransform.factor
    return obj
  },
  defaultTransform
)
export const getTransformFunctionParams = state => state.transformFunction

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
