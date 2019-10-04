import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import { byIdSelectorCreator } from './selectorCreators'
import { getMainPlot, getXAxis, getYAxis, getZAxis, getCatAxis } from './plot';
import { getFilteredList } from './filter';
import { clampDomain } from './field'
import { getDatasetID } from './location';
import { getZScale, getPlotResolution, getTransformFunction, getPlotScale } from './plotParameters';
import { getColorPalette } from './color';
import { getFilteredDataForFieldId,
  getCategoryListForFieldId,
  getPlainCategoryListForFieldId } from './preview'
import { getRawDataForFieldId, getDetailsForFieldId, getBinsForFieldId, getMetaDataForField, getBinsForCat } from './field'
import store from '../store'
import * as d3 from 'd3'
import cloneFunction from 'clone-function'
import { getQueryValue } from './location'

const getAxis = (state,axis) => axis

export const getAxisTitle = createSelector(
  getAxis,
  getMainPlot,
  (axis,plot) => {
    return plot.axes[axis]
  }
)

const getRawDataForX = createSelector(
  (state) => getRawDataForFieldId(state,getXAxis(state)),
  data => data
)

const getRawDataForY = createSelector(
  (state) => getRawDataForFieldId(state,getYAxis(state)),
  data => data
)

const getRawDataForZ = createSelector(
  (state) => getRawDataForFieldId(state,getZAxis(state)),
  data => data
)

export const getRawDataForCat = createSelector(
  (state) => getRawDataForFieldId(state,getCatAxis(state)),
  data => data
)

const getFilteredDataForX = createSelector(
  (state) => getFilteredDataForFieldId(state,getXAxis(state)),
  data => {
    return data
  }
)

const getFilteredDataForY = createSelector(
  (state) => getFilteredDataForFieldId(state,getYAxis(state)),
  data => data
)

const getFilteredDataForZ = createSelector(
  (state) => getFilteredDataForFieldId(state,getZAxis(state)),
  data => data
)

export const getFilteredDataForCat = createSelector(
  (state) => getFilteredDataForFieldId(state,getCatAxis(state)),
  data => data
)

export const getFilteredDataForGC = createSelector(
  (state) => getFilteredDataForFieldId(state,'gc'),
  data => data
)

export const getFilteredDataForLength = createSelector(
  (state) => getFilteredDataForFieldId(state,'length'),
  data => data
)

export const getFilteredDataForNCount = createSelector(
  (state) => getFilteredDataForFieldId(state,'ncount'),
  data => data
)


const getDetailsForX = createSelector(
  (state) => getDetailsForFieldId(state,getXAxis(state)),
  data => data
)

const getDetailsForY = createSelector(
  (state) => getDetailsForFieldId(state,getYAxis(state)),
  data => data
)

const getDetailsForZ = createSelector(
  (state) => getDetailsForFieldId(state,getZAxis(state)),
  data => data
)

export const getDetailsForCat = createSelector(
  (state) => getDetailsForFieldId(state,getCatAxis(state)),
  data => data
)

export const getMainPlotData = createSelector(
  getDatasetID,
  getFilteredDataForX,
  getFilteredDataForY,
  getFilteredDataForZ,
  getFilteredDataForCat,
  getDetailsForX,
  getDetailsForY,
  getDetailsForZ,
  getDetailsForCat,
  (dsId,xData,yData,zData,catData,xMeta,yMeta,zMeta,catMeta) => {
    if (!dsId || !catData) return undefined
    let plotData = {id:'default',axes:{},meta:{}};
    plotData.axes.x = xData || {values:[]}
    let xDomain = xMeta.xScale ? xMeta.xScale.domain().slice(0) : [0,10]
    let xmin = getQueryValue('xmin')
    if (xmin){
      xDomain[0] = 1*xmin
    }
    let xmax = getQueryValue('xmax')
    if (xmax){
      xDomain[1] = 1*xmax
    }
    xMeta.xScale.domain(xDomain)
    plotData.meta.x = xMeta
    plotData.axes.y = yData || {values:[]}
    let yDomain = yMeta.xScale ? yMeta.xScale.domain().slice(0) : [0,10]
    let ymin = getQueryValue('ymin')
    if (ymin){
      yDomain[0] = 1*ymin
    }
    let ymax = getQueryValue('ymax')
    if (ymax){
      yDomain[1] = 1*ymax
    }
    if (yMeta.xScale) yMeta.xScale.domain(yDomain)
    plotData.meta.y = yMeta
    plotData.axes.z = zData || {values:[]}
    plotData.meta.z = zMeta
    plotData.axes.cat = catData
    plotData.meta.cat = catMeta
    return plotData;
  }
);

export const getAllMainPlotData = createSelector(
  getDatasetID,
  getRawDataForX,
  getRawDataForY,
  getRawDataForZ,
  getRawDataForCat,
  getDetailsForX,
  getDetailsForY,
  getDetailsForZ,
  getDetailsForCat,
  (dsId,xData,yData,zData,catData,xMeta,yMeta,zMeta,catMeta) => {
    if (!dsId || !xData || !yData || !zData || !catData) return undefined
    let plotData = {id:'default',axes:{},meta:{},scale:{}};
    plotData.axes.x = xData || {values:[]}
    let xDomain = xMeta.xScale.domain().slice(0)
    let xmin = getQueryValue('xmin')
    if (xmin){
      xDomain[0] = 1*xmin
    }
    let xmax = getQueryValue('xmax')
    if (xmax){
      xDomain[1] = 1*xmax
    }
    if (xMeta.meta.clamp && xMeta.meta.clamp > xMeta.meta.limit[0]){
      xDomain = clampDomain(xMeta.meta.limit[1], xMeta.meta.clamp, 25)
      xMeta.xScale.clamp(true)
    }
    xMeta.xScale.domain(xDomain)
    plotData.meta.x = xMeta
    plotData.scale.x = xMeta.xScale
    plotData.axes.y = yData || {values:[]}
    let yDomain = yMeta.xScale.domain().slice(0)
    let ymin = getQueryValue('ymin')
    if (ymin){
      yDomain[0] = 1*ymin
    }
    let ymax = getQueryValue('ymax')
    if (ymax){
      yDomain[1] = 1*ymax
    }
    if (yMeta.meta.clamp && yMeta.meta.clamp > yMeta.meta.limit[0]){
      yDomain = clampDomain(yMeta.meta.limit[1], yMeta.meta.clamp, 25)
      // domain = [meta.clamp, range[1]]
      yMeta.xScale.clamp(true)
    }
    yMeta.xScale.domain(yDomain)
    plotData.meta.y = yMeta
    plotData.scale.y = yMeta.xScale
    plotData.axes.z = zData || {values:[]}
    plotData.meta.z = zMeta
    plotData.scale.z = zMeta.xScale
    plotData.axes.cat = catData
    plotData.meta.cat = catMeta
    plotData.scale.cat = catMeta.xScale
    return plotData;
  }
);

export const getAllScatterPlotData = createSelector(
  getAllMainPlotData,
  getTransformFunction,
  (plotData,transform) => {
    if (!plotData) return undefined
    let data = [];
    let scales = {};
    let axes = ['x','y','z']
    if (plotData.axes.x.values.length == 0 ||
        plotData.axes.y.values.length == 0 ||
        plotData.axes.z.values.length == 0){
      return {data:[]}
    }
    axes.forEach(axis=>{
      scales[axis] = plotData.scale[axis].copy();
      // if (axis == 'z'){
      //   scales[axis] = d3.scaleSqrt().domain(scales[axis].domain())
      // }
      scales[axis].range([0,900])
    })
    let len = plotData.axes.x.values.length
    let yClamp = plotData.meta.y.meta.clamp || Number.NEGATIVE_INFINITY
    let yMin = plotData.meta.y.meta.limit[0]
    if (yClamp < yMin){
      yClamp = Number.NEGATIVE_INFINITY
    }
    let xClamp = plotData.meta.x.meta.clamp || Number.NEGATIVE_INFINITY
    let xMin = plotData.meta.x.meta.limit[0]
    if (xClamp < xMin){
      xClamp = Number.NEGATIVE_INFINITY
    }
    for (let i = 0; i < len; i++){
      let y = plotData.axes.y.values[i]
      let x = plotData.axes.x.values[i]
      if (x >= plotData.meta.x.meta.limit[0] && x <= plotData.meta.x.meta.limit[1]
          && y >= plotData.meta.y.meta.limit[0] && y <= plotData.meta.y.meta.limit[1]){
        y = y < yClamp ? scales.y(yMin) : scales.y(y)
        x = x < xClamp ? scales.x(xMin) : scales.x(x)
        if (transform) [x,y] = transform([x,y])
        data.push({
          id:i,
          x: x,
          y: 900 - y,
          z: plotData.axes.z.values[i]
        })
      }

    }
    return {data}
  }
)

export const getScatterPlotData = createSelector(
  getMainPlotData,
  getFilteredList,
  getTransformFunction,
  (plotData,list,transform) => {
    if (!plotData) return undefined
    let data = [];
    let scales = {};
    let axes = ['x','y','z']
    if (plotData.axes.x.values.length == 0 &&
        plotData.axes.y.values.length == 0 &&
        plotData.axes.z.values.length == 0){
      return {data:[]}
    }
    axes.forEach(axis=>{
      scales[axis] = plotData.meta[axis].xScale ? plotData.meta[axis].xScale.copy() : d3.scaleLinear().domain([0,10]);
      if (axis == 'z'){
        scales[axis] = d3.scaleSqrt().domain(scales[axis].domain())
      }
      scales[axis].range([0,900])
    })
    let min = Number.POSITIVE_INFINITY
    let max = Number.NEGATIVE_INFINITY
    let len = Math.max(
                plotData.axes.x.values.length,
                plotData.axes.y.values.length,
                plotData.axes.z.values.length
              )
    let yClamp = Number.NEGATIVE_INFINITY
    if (plotData.meta.y.meta){
      let yClamp = plotData.meta.y.meta.clamp || Number.NEGATIVE_INFINITY
      let yMin = plotData.meta.y.meta.limit[0]
      if (yClamp < yMin){
        yClamp = Number.NEGATIVE_INFINITY
      }
    }
    let xClamp = plotData.meta.x.meta.clamp || Number.NEGATIVE_INFINITY
    let xMin = plotData.meta.x.meta.limit[0]
    if (xClamp < xMin){
      xClamp = Number.NEGATIVE_INFINITY
    }
    for (let i = 0; i < len; i++){
      let y = plotData.axes.y.values[i]
      y = y < yClamp ? scales.y(yMin) : scales.y(y)
      let x = plotData.axes.x.values[i]
      x = x < xClamp ? scales.x(xMin) : scales.x(x)
      let z = plotData.axes.z.values[i]
      // if (transform) [x,y] = transform([x,y])
      data.push({
        id:list[i],
        index:i,
        x: x,
        y: 900 - y,
        z: z
      })
      // if (i == 1){
        max = Math.max(max,z)
        min = Math.min(min,z)
      // }

    }
    let range = [min,max]
    return {data,range};
  }
)

export const getScatterPlotDataByCategory = createSelector(
  getMainPlotData,
  getScatterPlotData,
  getBinsForCat,
  getColorPalette,
  (plotData,scatterData,bins,palette) => {
    if (!plotData || !scatterData || !bins) return undefined
    let data = [];
    let keys = {}
    if (plotData.axes.cat.values.length == 0){
      return {data:[]}
    }
    bins.forEach((bin,i)=>{
      data[i] = []
      bin.keys.forEach(key=>{
        keys[key] = i
      })
    })
    let len = plotData.axes.x.values.length
    for (let i = 0; i < len; i++){
      data[keys[plotData.axes.cat.values[i]]].push(
        scatterData.data[i]
      )
    }
    return {data,bins};
  }
)


// const weighted_mean_sd = (values, weights, sumWeight, log) => {
//   if (log){
//     let sum = 0
//     let len = values.length
//     for (let i = 0; i < len; i++){
//       sum += Math.log10(values[i])*weights[i]
//     }
//     let mean = sum/sumWeight
//     let variance = 0
//     for (let i = 0; i < len; i++){
//       variance += weights[i] * ((Math.log10(values[i]) - mean) ** 2)
//     }
//     variance /= sumWeight
//     let stDev = Math.sqrt(variance)
//     let upper = 10 ** (mean + 2 * stDev)
//     let lower = 10 ** (mean - 2 * stDev)
//     mean = 10 ** mean
//     return {mean, stDev, upper, lower}
//   }
//   else {
//     let sum = 0
//     let len = values.length
//     for (let i = 0; i < len; i++){
//       sum += values[i]*weights[i]
//     }
//     let mean = sum/sumWeight
//     let variance = 0
//     for (let i = 0; i < len; i++){
//       variance += weights[i] * (values[i] - mean) ** 2
//     }
//     variance /= sumWeight
//     let stDev = Math.sqrt(variance)
//     let upper = mean + 2 * stDev
//     let lower = mean - 2 * stDev
//     return {mean, stDev, upper, lower}
//   }
// }

const weightedMedian = (arr, total) => {
  if (arr.length == 0) return undefined
  let sum = 0
  let mid = total / 2
  let median
  let sorted = arr.sort((a, b) => a.value - b.value)
  for (let i = 0; i < arr.length; i++){
    sum += sorted[i].weight
    if (sum > mid){
      return sorted[i].value
    }
  }
};

const weighted_mean_sd = (values, weights, sumWeight, log) => {
  if (log){
    let sum = 0
    let len = values.length
    let arr = []
    for (let i = 0; i < len; i++){
      sum += Math.log10(values[i])*weights[i]
      arr.push({weight: weights[i], i, value: values[i]})
    }
    let median = weightedMedian(arr, sumWeight)
    let mean = sum/sumWeight
    let variance = 0
    for (let i = 0; i < len; i++){
      variance += weights[i] * ((Math.log10(values[i]) - mean) ** 2)
    }
    variance /= sumWeight
    let stDev = Math.sqrt(variance)
    let upper = 10 ** (mean + 2 * stDev)
    let lower = 10 ** (mean - 2 * stDev)
    mean = 10 ** mean
    return {mean, median, stDev, upper, lower}
  }
  else {
    let sum = 0
    let len = values.length
    let arr = []
    for (let i = 0; i < len; i++){
      sum += values[i]*weights[i]
      arr.push({weight: weights[i], i, value: values[i]})
    }
    let median = weightedMedian(arr, sumWeight)
    let mean = sum/sumWeight
    let variance = 0
    for (let i = 0; i < len; i++){
      variance += weights[i] * (values[i] - mean) ** 2
    }
    variance /= sumWeight
    let stDev = Math.sqrt(variance)
    let upper = mean + 2 * stDev
    let lower = mean - 2 * stDev
    return {mean, median, stDev, upper, lower}
  }
}


export const getKitePlotData = createSelector(
  getMainPlotData,
  getBinsForCat,
  getColorPalette,
  (plotData,bins,palette) => {
    if (!plotData || !bins) return undefined
    let data = [];
    let keys = {}
    if (plotData.axes.cat.values.length == 0){
      return {data:[]}
    }
    bins.forEach((bin,i)=>{
      data[i] = {x:[],y:[],xWeight:[],yWeight:[],xWeightSum:0,yWeightSum:0}
      bin.keys.forEach(key=>{
        keys[key] = i
      })
    })
    let len = plotData.axes.x.values.length
    for (let i = 0; i < len; i++){
      let bin = keys[plotData.axes.cat.values[i]]
      let x = plotData.axes.x.values[i]
      let y = plotData.axes.y.values[i]
      let z = plotData.axes.z.values[i]
      if (!plotData.meta.x.meta.clamp || x >= plotData.meta.x.meta.clamp){
        data[bin].x.push(x)
        data[bin].xWeight.push(z)
        data[bin].xWeightSum += z
      }
      if (!plotData.meta.y.meta.clamp || y >= plotData.meta.y.meta.clamp){
        data[bin].y.push(y)
        data[bin].yWeight.push(z)
        data[bin].yWeightSum += z
      }
    }
    let coords = []
    let yScale = plotData.meta.y.xScale.copy()
    let xScale = plotData.meta.x.xScale.copy()
    yScale.range([900,0])
    xScale.range([0,900])
    data.forEach((bin,i)=>{
      coords[i] = {}
      bin.xWeighted = weighted_mean_sd(bin.x, bin.xWeight, bin.xWeightSum, plotData.meta.x.meta.scale == 'scaleLog')
      bin.yWeighted = weighted_mean_sd(bin.y, bin.yWeight, bin.yWeightSum, plotData.meta.y.meta.scale == 'scaleLog')
      // coords[i].x = [
      //   [xScale(bin.xWeighted.lower),yScale(bin.yWeighted.mean)],
      //   [xScale(bin.xWeighted.upper),yScale(bin.yWeighted.mean)]
      // ]
      // coords[i].y = [
      //   [xScale(bin.xWeighted.mean),yScale(bin.yWeighted.lower)],
      //   [xScale(bin.xWeighted.mean),yScale(bin.yWeighted.upper)]
      // ]
      // coords[i].poly = [
      //   [xScale(bin.xWeighted.lower),yScale(bin.yWeighted.mean)],
      //   [xScale(bin.xWeighted.mean),yScale(bin.yWeighted.lower)],
      //   [xScale(bin.xWeighted.upper),yScale(bin.yWeighted.mean)],
      //   [xScale(bin.xWeighted.mean),yScale(bin.yWeighted.upper)],
      //   [xScale(bin.xWeighted.lower),yScale(bin.yWeighted.mean)]
      // ]
      if (bin.xWeighted.lower){
        coords[i].x = [
          [xScale(bin.xWeighted.lower),yScale(bin.yWeighted.median)],
          [xScale(bin.xWeighted.upper),yScale(bin.yWeighted.median)]
        ]
        coords[i].y = [
          [xScale(bin.xWeighted.median),yScale(bin.yWeighted.lower)],
          [xScale(bin.xWeighted.median),yScale(bin.yWeighted.upper)]
        ]
        coords[i].poly = [
          [xScale(bin.xWeighted.lower),yScale(bin.yWeighted.median)],
          [xScale(bin.xWeighted.median),yScale(bin.yWeighted.lower)],
          [xScale(bin.xWeighted.upper),yScale(bin.yWeighted.median)],
          [xScale(bin.xWeighted.median),yScale(bin.yWeighted.upper)],
          [xScale(bin.xWeighted.lower),yScale(bin.yWeighted.median)]
        ]
      }

    })
    return {coords,bins,colors:palette.colors};
  }
)

const sliceObject = (obj,index) => {
  let slice = {};
  Object.keys(obj).forEach(key =>{
    slice[key] = obj[key].slice(index,index+1)[0]
  })
  return slice;
}
const createSelectorForCategoryIndex = byIdSelectorCreator();
const createSelectorForCircleCategoryIndex = byIdSelectorCreator();
const createSelectorForSquareCategoryIndex = byIdSelectorCreator();
const createSelectorForSliceIndex = byIdSelectorCreator();
const createSelectorForColorIndex = byIdSelectorCreator();

const _getCategoryIndexAsMemoKey = (state, categoryIndex) => categoryIndex;
//const getScatterPlotDataForCategory = (state, categoryIndex) => getScatterPlotDataByCategory(state)[categoryIndex];
const getColorByIndex = createSelectorForColorIndex(
  _getCategoryIndexAsMemoKey,
  _getCategoryIndexAsMemoKey,
  getColorPalette,
  (index,palette) => {
    return palette.colors[index]
  }
)

export const getScatterPlotDataSlice = createSelectorForSliceIndex(
  _getCategoryIndexAsMemoKey,
  _getCategoryIndexAsMemoKey,
  getScatterPlotDataByCategory,
  (index,plotData) => {
    plotData = sliceObject(plotData,index)
    return plotData
  }
)

export const getScatterPlotDataForCategoryIndex = createSelectorForCategoryIndex(
  _getCategoryIndexAsMemoKey,
  getScatterPlotDataSlice,
  getColorByIndex,
  (plotData,color,res) => {
    plotData.color = color
    return plotData
  }
);

export const getCirclePlotDataForCategoryIndex = createSelectorForCircleCategoryIndex(
  _getCategoryIndexAsMemoKey,
  getScatterPlotDataForCategoryIndex,
  getDetailsForZ,
  getZScale,
  getPlotResolution,
  getPlotScale,
  (catData,details,scale,res,plotScale) => {
    let zScale = d3[scale]().domain(details.range).range([0,2*900/res])
    if (catData.data){
      catData.data.forEach(datum => {
        datum.r = zScale(datum.z)* plotScale
      })
    }
    else {
      catData.data = []
    }
    return catData
  }
);

export const getSquareBinPlotDataForCategoryIndex = createSelectorForSquareCategoryIndex(
  _getCategoryIndexAsMemoKey,
  getScatterPlotDataForCategoryIndex,
  (plotData) => {
    let size = 900 // FIXME: magic number
    let res = 20 // FIXME: magic number
    let side = size/res
    let squares = []
    for (let i = 0; i <= res; i++){
      squares[i] = []
      for (let j = 0; j <= res; j++){
        squares[i][j] = {id:i+'_'+j,x:i,y:j,ids:[],zs:[],indices:[]}
      }
    }
    plotData.data.forEach(datum=>{
      let x = Math.floor(datum.x/side)
      let y = Math.floor(datum.y/side)
      squares[x][y].ids.push(datum.id)
      squares[x][y].indices.push(datum.index)
      squares[x][y].zs.push(datum.z)
    })
    let data = [];
    for (let i = 0; i < res; i++){
      for (let j = 0; j < res; j++){
        if (squares[i][j].ids.length > 0){
          data.push(squares[i][j])
        }
      }
    }
    plotData.data = data
    plotData.side = side
    return plotData
  }
);

const createSelectorForMainPlotCategory = byIdSelectorCreator();

export const getCategoryListForMainPlot = createSelectorForMainPlotCategory(
  getAxisTitle,
  (state) => getPlainCategoryListForFieldId(state,getAxisTitle(state,'cat')),
  (list) => {
    return list
  }
)
