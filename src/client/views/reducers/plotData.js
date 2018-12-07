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
    if (!dsId || !xData || !yData || !zData || !catData) return undefined
    let plotData = {id:'default',axes:{},meta:{}};
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
    xMeta.xScale.domain(xDomain)
    plotData.meta.x = xMeta
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
    yMeta.xScale.domain(yDomain)
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
    if (xMeta.meta.clamp){
      xDomain = clampDomain(xMeta.range[1], xMeta.meta.clamp, 25)
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
    if (yMeta.meta.clamp){
      yDomain = clampDomain(yMeta.range[1], yMeta.meta.clamp, 25)
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
    let yMin = plotData.meta.y.range[0]
    let xClamp = plotData.meta.x.meta.clamp || Number.NEGATIVE_INFINITY
    let xMin = plotData.meta.x.range[0]
    for (let i = 0; i < len; i++){
      let y = plotData.axes.y.values[i]
      y = y < yClamp ? scales.y(yMin) : scales.y(y)
      let x = plotData.axes.x.values[i]
      x = x < xClamp ? scales.x(xMin) : scales.x(x)
      if (transform) [x,y] = transform([x,y])
      data.push({
        id:i,
        x: x,
        y: 900 - y,
        z: plotData.axes.z.values[i]
      })
    }
    return {data};
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
    if (plotData.axes.x.values.length == 0 ||
        plotData.axes.y.values.length == 0 ||
        plotData.axes.z.values.length == 0){
      return {data:[]}
    }
    axes.forEach(axis=>{
      scales[axis] = plotData.meta[axis].xScale.copy();
      if (axis == 'z'){
        scales[axis] = d3.scaleSqrt().domain(scales[axis].domain())
      }
      scales[axis].range([0,900])
    })
    let min = Number.POSITIVE_INFINITY
    let max = Number.NEGATIVE_INFINITY
    let len = plotData.axes.x.values.length
    let yClamp = plotData.meta.y.meta.clamp || Number.NEGATIVE_INFINITY
    let yMin = plotData.meta.y.range[0]
    let xClamp = plotData.meta.x.meta.clamp || Number.NEGATIVE_INFINITY
    let xMin = plotData.meta.x.range[0]
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
    if (plotData.axes.x.values.length == 0 ||
        plotData.axes.y.values.length == 0 ||
        plotData.axes.z.values.length == 0 ||
        plotData.axes.cat.values.length == 0){
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
