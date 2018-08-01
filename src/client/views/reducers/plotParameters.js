import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import { byIdSelectorCreator } from './selectorCreators'
import { getFilteredList } from './filter'
import { getMainPlot } from './plot';
import immutableUpdate from 'immutable-update';
import store from '../store'
import qs from 'qs'
import { queryToStore, qsDefault } from '../querySync'
import history from './history'
import { urlViews, pathname, setPathname, loadDataset, viewsToPathname } from './repository'
import { getDatasetID } from './location'

export const setPlotShape = createAction('SET_PLOT_SHAPE')
export const choosePlotShape = (plotShape) => {
  return function (dispatch) {
    let values = {plotShape}
    dispatch(queryToStore({values}))
  }
}
export const plotShape = handleAction(
  'SET_PLOT_SHAPE',
  (state, action) => (
    action.payload
  ),
  qsDefault('plotShape')
)
export const getPlotShape = state => state.plotShape


export const setPlotResolution = createAction('SET_PLOT_RESOLUTION')
export const choosePlotResolution = (plotResolution) => {
  return function (dispatch) {
    let values = {plotResolution}
    dispatch(queryToStore({values}))
  }
}
export const plotResolution = handleAction(
  'SET_PLOT_RESOLUTION',
  (state, action) => (
    action.payload
  ),
  qsDefault('plotResolution')
)
export const getPlotResolution = state => state.plotResolution

export const setPlotScale = createAction('SET_PLOT_SCALE')
export const choosePlotScale = (plotScale) => {
  return function (dispatch) {
    let values = {plotScale}
    dispatch(queryToStore({values}))
  }
}
export const plotScale = handleAction(
  'SET_PLOT_SCALE',
  (state, action) => (
    action.payload
  ),
  qsDefault('plotScale')
)
export const getPlotScale = state => state.plotScale

export const setZScale = createAction('SET_Z_SCALE')
export const chooseZScale = (zScale) => {
  return function (dispatch) {
    let values = {zScale}
    dispatch(queryToStore({values}))
  }
}
export const zScale = handleAction(
  'SET_Z_SCALE',
  (state, action) => (
    action.payload
  ),
  qsDefault('zScale')
)
export const getZScale = state => state.zScale

export const setZReducer = createAction('SET_Z_REDUCER')
export const chooseZReducer = (zReducer) => {
  return function (dispatch) {
    let values = {zReducer}
    dispatch(queryToStore({values}))
  }
}
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

export const setCurveOrigin = createAction('SET_CURVE_ORIGIN')
export const chooseCurveOrigin = (curveOrigin) => {
  return function (dispatch) {
    let values = {curveOrigin}
    dispatch(queryToStore({values}))
  }
}
export const curveOrigin = handleAction(
  'SET_CURVE_ORIGIN',
  (state, action) => (
    action.payload
  ),
  qsDefault('curveOrigin')
)
export const getCurveOrigin = state => state.curveOrigin

export const setCircumferenceScale = createAction('SET_CIRCUMFERENCE_SCALE')
export const chooseCircumferenceScale = (circumferenceScale) => {
  return function (dispatch) {
    let values = {circumferenceScale}
    dispatch(queryToStore({values}))
  }
}
export const circumferenceScale = handleAction(
  'SET_CIRCUMFERENCE_SCALE',
  (state, action) => (
    action.payload
  ),
  qsDefault('circumferenceScale')
)
export const getCircumferenceScale = state => state.circumferenceScale

export const setRadiusScale = createAction('SET_RADIUS_SCALE')
export const chooseRadiusScale = (radiusScale) => {
  return function (dispatch) {
    let values = {radiusScale}
    dispatch(queryToStore({values}))
  }
}
export const radiusScale = handleAction(
  'SET_RADIUS_SCALE',
  (state, action) => (
    action.payload
  ),
  qsDefault('radiusScale')
)
export const getRadiusScale = state => state.radiusScale

export const setSnailOrigin = createAction('SET_SNAIL_ORIGIN')
export const chooseSnailOrigin = (snailOrigin) => {
  return function (dispatch) {
    let values = {snailOrigin}
    dispatch(queryToStore({values}))
  }
}
export const snailOrigin = handleAction(
  'SET_SNAIL_ORIGIN',
  (state, action) => (
    action.payload
  ),
  qsDefault('snailOrigin')
)
export const getSnailOrigin = state => state.snailOrigin


export const setSVGThreshold = createAction('SET_SVG_THRESHOLD')
export const chooseSVGThreshold = (svgThreshold) => {
  return function (dispatch) {
    let values = {svgThreshold}
    dispatch(queryToStore({values}))
  }
}
export const svgThreshold = handleAction(
  'SET_SVG_THRESHOLD',
  (state, action) => (
    action.payload
  ),
  qsDefault('svgThreshold')
)
export const getSVGThreshold = state => state.svgThreshold

export const setPlotGraphics = createAction('SET_PLOT_GRAPHICS')
export const choosePlotGraphics = (plotGraphics) => {
  return function (dispatch) {
    let values = {plotGraphics}
    dispatch(queryToStore({values}))
  }
}
export const plotGraphics = handleAction(
  'SET_PLOT_GRAPHICS',
  (state, action) => (
    action.payload
  ),
  qsDefault('plotGraphics')
)
const _getPlotGraphics = state => state.plotGraphics

export const getPlotGraphics = createSelector(
  _getPlotGraphics,
  getSVGThreshold,
  getFilteredList,
  (graphics,threshold,list)=>{
    if (graphics != 'svg' && graphics != 'canvas'){
      graphics = 'canvas'
      if (threshold >= list.length){
        graphics = 'svg'
      }
    }
    return graphics
  }
)

export const plotParameterReducers = {
  plotShape,
  plotResolution,
  plotGraphics,
  svgThreshold,
  plotScale,
  zScale,
  zReducer,
  transformFunction,
  curveOrigin,
  circumferenceScale,
  radiusScale,
  snailOrigin
}
