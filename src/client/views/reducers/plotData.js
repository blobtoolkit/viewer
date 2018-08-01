import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import { byIdSelectorCreator } from './selectorCreators'
import { getMainPlot } from './plot';
import { getFilteredList } from './filter';
import { getZScale, getPlotResolution, getTransformFunction } from './plotParameters';
import { getColorPalette } from './color';
import { getFilteredDataForFieldId,
  getCategoryListForFieldId,
  getPlainCategoryListForFieldId } from './preview'
import { getRawDataForFieldId, getDetailsForFieldId, getBinsForFieldId, getMetaDataForField } from './field'
import store from '../store'
import * as d3 from 'd3'
import cloneFunction from 'clone-function'
import { getQueryValue } from './location'
// import React from 'react'
// import { server } from 'react-dom'

const getAxis = (state,axis) => axis

export const getAxisTitle = createSelector(
  getAxis,
  getMainPlot,
  (axis,plot) => {
    return plot.axes[axis]
  }
)



export const getMainPlotData = createSelector(
  getMainPlot,
  (state) => getFilteredDataForFieldId(state,getMainPlot(state).axes.x),
  (state) => getFilteredDataForFieldId(state,getMainPlot(state).axes.y),
  (state) => getFilteredDataForFieldId(state,getMainPlot(state).axes.z),
  (state) => getFilteredDataForFieldId(state,getMainPlot(state).axes.cat),
  (state) => getDetailsForFieldId(state,getMainPlot(state).axes.x),
  (state) => getDetailsForFieldId(state,getMainPlot(state).axes.y),
  (state) => getDetailsForFieldId(state,getMainPlot(state).axes.z),
  (state) => getDetailsForFieldId(state,getMainPlot(state).axes.cat),
  (mainPlot,xData,yData,zData,catData,xMeta,yMeta,zMeta,catMeta) => {
    let plotData = {id:mainPlot.id,axes:{},meta:{}};
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
  getMainPlot,
  (state) => getRawDataForFieldId(state,getMainPlot(state).axes.x),
  (state) => getRawDataForFieldId(state,getMainPlot(state).axes.y),
  (state) => getRawDataForFieldId(state,getMainPlot(state).axes.z),
  (state) => getRawDataForFieldId(state,getMainPlot(state).axes.cat),
  (state) => getDetailsForFieldId(state,getMainPlot(state).axes.x),
  (state) => getDetailsForFieldId(state,getMainPlot(state).axes.y),
  (state) => getDetailsForFieldId(state,getMainPlot(state).axes.z),
  (state) => getDetailsForFieldId(state,getMainPlot(state).axes.cat),
  (mainPlot,xData,yData,zData,catData,xMeta,yMeta,zMeta,catMeta) => {
    let plotData = {id:mainPlot.id,axes:{},meta:{},scale:{}};
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

// const _getFieldIdAsMemoKey = (state, fieldId) => fieldId;
//
// const createScaleSelectorForFieldId = byIdSelectorCreator();
//
// export const getScaleForFieldId = createScaleSelectorForFieldId(
//   _getFieldIdAsMemoKey,
//   getMetaDataForField,
//   (meta = {}) => {
//     let range = meta.range || [1,10];
//     let xScale = d3[meta.scale || 'scaleLinear']()
//     let active = meta.hasOwnProperty('active') ? meta.active : meta.hasOwnProperty('preload') ? meta.preload : false
//     xScale.domain(range)
//     xScale.range([0,400])
//     let obj = {
//       meta,
//       xScale,
//       range,
//       active
//     }
//     return xScale
//   }
// );
//
// const getXScale = createSelector(
//   (state) => getScaleForFieldId(state,getMainPlot(state).axes.x),
//   xScale => {
//     console.log('xScale')
//     return xScale
//   }
// )
//
// const getYScale = createSelector(
//   (state) => getScaleForFieldId(state,getMainPlot(state).axes.x),
//   yScale => {
//     console.log('yScale')
//     return yScale
//   }
// )
//
// const getPlotZScale = createSelector(
//   (state) => getScaleForFieldId(state,getMainPlot(state).axes.x),
//   zScale => {
//     console.log('zScale')
//     return zScale
//   }
// )
//
// const getCatScale = createSelector(
//   (state) => getScaleForFieldId(state,getMainPlot(state).axes.x),
//   catScale => {
//     console.log('catScale')
//     return catScale
//   }
// )
//
// export const getAllMainPlotData = createSelector(
//   getMainPlot,
//   (state) => getRawDataForFieldId(state,getMainPlot(state).axes.x),
//   (state) => getRawDataForFieldId(state,getMainPlot(state).axes.y),
//   (state) => getRawDataForFieldId(state,getMainPlot(state).axes.z),
//   (state) => getRawDataForFieldId(state,getMainPlot(state).axes.cat),
//   getXScale,
//   getYScale,
//   getPlotZScale,
//   getCatScale,
//   (mainPlot,xData,yData,zData,catData,xScale,yScale,zScale,catScale) => {
//     console.time('getAllMainPlotData')
//     let plotData = {id:mainPlot.id,axes:{},scale:{}};
//     plotData.axes.x = xData || {values:[]}
//     let xDomain = xScale.domain().slice(0)
//     let xmin = getQueryValue('xmin')
//     if (xmin){
//       xDomain[0] = 1*xmin
//     }
//     let xmax = getQueryValue('xmax')
//     if (xmax){
//       xDomain[1] = 1*xmax
//     }
//     xScale.domain(xDomain)
//     plotData.scale.x = xScale
//     plotData.axes.y = yData || {values:[]}
//     let yDomain = yScale.domain().slice(0)
//     let ymin = getQueryValue('ymin')
//     if (ymin){
//       yDomain[0] = 1*ymin
//     }
//     let ymax = getQueryValue('ymax')
//     if (ymax){
//       yDomain[1] = 1*ymax
//     }
//     yScale.domain(yDomain)
//     plotData.scale.y = yScale
//     plotData.axes.z = zData || {values:[]}
//     plotData.scale.z = zScale
//     plotData.axes.cat = catData
//     plotData.scale.cat = catScale
//     console.timeEnd('getAllMainPlotData')
//
//     return plotData;
//   }
// );

export const getAllScatterPlotData = createSelector(
  getAllMainPlotData,
  getTransformFunction,
  (plotData,transform) => {
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
    for (let i = 0; i < len; i++){
      let y = scales.y(plotData.axes.y.values[i])
      let x = scales.x(plotData.axes.x.values[i])
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

// export const getScatterPlotData = createSelector(
//   getAllScatterPlotData,
//   getFilteredList,
//   (allData,list) => {
//     console.time('getScatterPlotData')
//     let data = [];
//     let len = list.length
//     let max = Number.NEGATIVE_INFINITY
//     let min = Number.POSITIVE_INFINITY
//     for (let i = 0; i < len; i++){
//       // let d = allData.data[list[i]]
//       data.push({
//         ...allData.data[list[i]]
//       })
//
//       max = Math.max(max,allData.data[list[i]].z)
//       min = Math.min(min,allData.data[list[i]].z)
//     }
//     let range = [min,max]
//     console.timeEnd('getScatterPlotData')
//     return {data,range};
//   }
// )

export const getScatterPlotData = createSelector(
  getMainPlotData,
  getFilteredList,
  getTransformFunction,
  (plotData,list,transform) => {
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
    for (let i = 0; i < len; i++){
      let z = plotData.axes.z.values[i]
      let y = scales.y(plotData.axes.y.values[i])
      let x = scales.x(plotData.axes.x.values[i])
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

// export const getPlotGraphics = createSelector(
//   getFilteredList,
//   () => getQueryValue('plotGraphics'),
//   (list,graphics) => {
//     console.log(graphics)
//     if (graphics == 'svg' || graphics == 'canvas'){
//       return graphics
//     }
//     let threshold = 10000
//     let plotGraphics = 'canvas'
//     if (list.length < threshold){
//       plotGraphics = 'svg'
//     }
//     return plotGraphics;
//   }
// )

export const getScatterPlotDataByCategory = createSelector(
  getMainPlotData,
  getScatterPlotData,
  (state) => getBinsForFieldId(state,getMainPlot(state).axes.cat),
  getColorPalette,
  (plotData,scatterData,bins,palette) => {
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
  (state) => getDetailsForFieldId(state,getMainPlot(state).axes.z),
  getZScale,
  getPlotResolution,
  (catData,details,scale, res) => {
    let zScale = d3[scale]().domain(details.range).range([0,2*900/res])
    if (catData.data){
      catData.data.forEach(datum => {
        datum.r = zScale(datum.z)
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

// export const getScatterCanvasForCategoryIndex = createSelectorForCategoryIndex(
//   _getCategoryIndexAsMemoKey,
//   getScatterPlotDataForCategoryIndex,
//   (plotData) => {
//     console.log('getScatterCanvasForCategoryIndex')
//     const canvas = React.createElement('canvas');
//     const ctx = canvas.getContext('2d');
//     ctx.globalAlpha=0.4
//     ctx.fillStyle = plotData.color;
//     ctx.lineWidth = 0.25;
//     ctx.strokeStyle = '#999';
//     plotData.data.map(bubble => {
//       ctx.beginPath();
//       ctx.arc(bubble.cx, bubble.cy, bubble.r, 0, 2 * Math.PI, false);
//       ctx.fill();
//       ctx.stroke();
//     })
//     console.log(canvas)
//     return canvas
//   }
// );


// FIXME:
// export const getCategoryListForMainPlot = createSelector(
//   state => getCategoryListForFieldId(state,getMainPlot(state).axes.cat),
//   list => {
//     console.log('getCategoryListForMainPlot')
//     return list
//   }
// )

 // const _getMainPlotCategory = createSelector(
 //   getMainPlot,
 //   plot => {
 //     console.log(plot.axes.cat)
 //     return plot.axes.cat
 //   }
 // )

const createSelectorForMainPlotCategory = byIdSelectorCreator();

export const getCategoryListForMainPlot = createSelectorForMainPlotCategory(
  getAxisTitle,
  (state) => getPlainCategoryListForFieldId(state,getAxisTitle(state,'cat')),
  (list) => {
    return list
  }
)

// const hexCorner = (center, radius, i) => {
//   let angle_deg = 60 * i + 30
//   let angle_rad = Math.PI / 180 * angle_deg
//   return {
//     cx:center.x + radius * Math.cos(angle_rad),
//     cy:center.y + radius * Math.sin(angle_rad)
//   }
// }
//
// const cube_to_axial = cube => {
//   let q = cube.x
//   let r = cube.z
//   return {q, r}
// }
//
// const axial_to_cube = hex => {
//   let x = hex.q
//   let z = hex.r
//   let y = -x-z
//   return {x, y, z}
// }
//
// const cube_to_oddr = cube => {
//   let i = cube.x + (cube.z - (cube.z&1)) / 2
//   let j = cube.z
//   return {i, j}
// }
//
// const oddr_to_cube = oddr => {
//   let x = oddr.j - (oddr.i - (oddr.i&1)) / 2
//   let z = oddr.i
//   let y = -x-z
//   return {x, y, z}
// }
//
// const hex_round = hex => {
//   return {q:Math.round(hex.q),r:Math.round(hex.r)}
// }
//
// const pixel_to_hex = (x, y, radius) => {
//   let q = (x * Math.sqrt(3)/3 - y / 3) / radius
//   let r = y * 2/3 / radius
//   return hex_round({q, r})
// }
//
// const pixel_to_oddr = (x, y, radius) => {
//   return cube_to_oddr(axial_to_cube(pixel_to_hex(x, y, radius)))
// }
//
// const drawPoints = (i,j,radius,res,scale = 1) => {
//   let center
//   let height = radius
//   let width = Math.sqrt(3) * radius
//   let corners = [0,1,2,3,4,5]
//   if (j%2 == 0){
//     center = {x:(i)*width,y:(j)*height*(3/2)}
//   }
//   else if (i < res) {
//     center = {x:(i)*width+width/2,y:(j)*height*(3/2)}
//   }
//   if (center){
//     radius = radius * scale
//     let vertices = corners.map(i=>hexCorner(center,radius,i))
//     let points = vertices.map(v=>v.cx+','+v.cy).join(' ')
//     return points
//   }
//   return
// }
//
// const getHexGrid = createSelector(
//   _getMainPlotCategory,
//   () => {
//     let size = 1000 // FIXME: magic number
//     let res = 20 // FIXME: magic number
//     let radius = (size/res)*(Math.sqrt(3)/3)
//     let height = radius
//     let width = Math.sqrt(3) * radius
//     let hexes = []
//     for (let i = 0; i <= res; i++){
//       hexes[i] = []
//       for (let j = 0; j <= res*1.2; j++){
//         let points = drawPoints(i,j,radius,res)
//         if (points) hexes[i][j] = {id:i+'_'+j,x:i,y:j,points}
//       }
//     }
//     let data = [];
//     for (let i = 0; i <= res; i++){
//       for (let j = 0; j <= res*1.2; j++){
//         if (hexes[i][j]) data.push(hexes[i][j])
//       }
//     }
//     return { data,size,res,radius,height,width }
//   }
// )
//
// export const getHexBinPlotDataForCategoryIndex = createSelectorForCategoryIndex(
//   _getCategoryIndexAsMemoKey,
//   getScatterPlotDataForCategoryIndex,
//   getHexGrid,
//   (plotData, grid) => {
//     let hexes = []
//     grid.data.forEach(d=>{
//       hexes[d.x] = hexes[d.x] || []
//       hexes[d.x][d.y] = {id:d.id,x:d.x,y:d.y,ids:[],zs:[]}
//     })
//     plotData.data.forEach(datum=>{
//       let coords = pixel_to_oddr(datum.x,datum.y,grid.radius)
//       if (hexes[coords.i] && hexes[coords.i][coords.j]){
//         hexes[coords.i][coords.j].ids.push(datum.id)
//         hexes[coords.i][coords.j].zs.push(datum.z)
//       }
//     })
//     let data = [];
//     for (let x = 0; x < hexes.length; x++){
//       for (let y = 0; y < hexes[x].length; y++){
//         if (hexes[x][y] && hexes[x][y].ids.length > 0){
//           let scale = Math.log(hexes[x][y].zs.reduce((a,b)=>a+b))/15
//           // let scale = Math.log(Math.max(...hexes[x][y].zs))/8
//           hexes[x][y].points = drawPoints(x,y,grid.radius,grid.res,scale)
//           // hexes[x][y].points = drawPoints(x,y,grid.radius,grid.res)
//           data.push(hexes[x][y])
//         }
//       }
//     }
//     console.log(data)
//     return {data,color:plotData.color}
//   }
// );
