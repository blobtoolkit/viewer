import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import { byIdSelectorCreator } from './selectorCreators'
import { getMainPlot } from './plot';
import immutableUpdate from 'immutable-update';


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
  30
)
const _getPlotResolution = state => state.plotResolution
export const getPlotResolution = createSelector(
  _getPlotResolution,
  res => res
)
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
    if (zReducers[action.payload]) return {id:action.payload,func:zReducers[action.payload]}
  },
  {id:'sum',func:zReducers.sum}
)
export const getZReducer = state => state.zReducer

export const setTransformFunction = createAction('EDIT_Y_TRANSFORM')
export const transformFunction = handleAction(
  'EDIT_Y_TRANSFORM',
  (state, action) => {
    return immutableUpdate(state,action.payload)
      //Object.assign(...Object.keys(action.payload).map(f => ({[f]: action.payload[f]})))
  },
  {
    x:500,
    order:1,
    factor:0
  }
)

export const getTransformFunctionParams = state => state.transformFunction
export const getTransformFunction = createSelector(
  getTransformFunctionParams,
  (props) => {
  let factor = props.factor / 1000
  return (([x,y]) => {
    let newY = y + ((Math.abs(props.x-x)**props.order) * (props.factor / 1000**(props.order-1)))
    return [x,newY]
  })
})


export const plotParameterReducers = {
  plotShape,
  plotResolution,
  plotGraphics,
  plotScale,
  zScale,
  zReducer,
  transformFunction
}
