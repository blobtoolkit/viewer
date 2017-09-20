import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import { byIdSelectorCreator } from './selectorCreators'
import { getMainPlot } from './plot';
import { getColorPalette } from './color';
import { getFilteredDataForFieldId,
  getCategoryListForFieldId,
  getPlainCategoryListForFieldId } from './preview'
import { getDetailsForFieldId, getBinsForFieldId } from './field'
import store from '../store'
import * as d3 from 'd3'
import cloneFunction from 'clone-function'
// import React from 'react'
// import { server } from 'react-dom'

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
    plotData.axes.x = xData
    plotData.meta.x = xMeta
    plotData.axes.y = yData
    plotData.meta.y = yMeta
    plotData.axes.z = zData
    plotData.meta.z = zMeta
    plotData.axes.cat = catData
    plotData.meta.cat = catMeta
    return plotData;
  }
);

export const getScatterPlotData = createSelector(
  getMainPlotData,
  (plotData) => {
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
      scales[axis].range([0,1000])
    })
    let len = plotData.axes.x.values.length
    // let limits = {
    //   x:[Math.Infinity,-Math.Infinity],
    //   y:[Math.Infinity,-Math.Infinity],
    //   z:[Math.Infinity,-Math.Infinity]
    // }
    for (let i = 0; i < len; i++){
      data.push({
        id:i,
        x: scales.x(plotData.axes.x.values[i]),
        y: 1000 - scales.y(plotData.axes.y.values[i]),
        z: plotData.axes.z.values[i]
      })
      // for (let i = 0; i < 3; i++){
      //   if (datum[axes[i]] < limits[axes[i]][0]) limits[axes[i]][0] = datum[axes[i]]
      //   if (datum[axes[i]] > limits[axes[i]][1]) limits[axes[i]][1] = datum[axes[i]]
      // }
      //data.push(datum)
    }

    return {data};
  }
)

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
  console.log(slice)
  return slice;
}
const createSelectorForCategoryIndex = byIdSelectorCreator();
const createSelectorForSliceIndex = byIdSelectorCreator();
const createSelectorForColorIndex = byIdSelectorCreator();

const _getCategoryIndexAsMemoKey = (state, categoryIndex) => categoryIndex;
//const getScatterPlotDataForCategory = (state, categoryIndex) => getScatterPlotDataByCategory(state)[categoryIndex];
const getColorByIndex = createSelectorForColorIndex(
  _getCategoryIndexAsMemoKey,
  _getCategoryIndexAsMemoKey,
  getColorPalette,
  (index,palette) => {
    console.log('getColorByIndex')
    return palette.colors[index]
  }
)

export const getScatterPlotDataSlice = createSelectorForSliceIndex(
  _getCategoryIndexAsMemoKey,
  _getCategoryIndexAsMemoKey,
  getScatterPlotDataByCategory,
  (index,plotData) => {
    plotData = sliceObject(plotData,index)
    //plotData.color = palette.colors[index]
    console.log('getScatterPlotDataSlice')
    return plotData
  }
)

export const getScatterPlotDataForCategoryIndex = createSelectorForCategoryIndex(
  _getCategoryIndexAsMemoKey,
  getScatterPlotDataSlice,
  getColorByIndex,
  (plotData,color) => {
    plotData.color = color
    console.log('getScatterPlotDataForCategoryIndex')
    return plotData
  }
);

export const getSquareBinPlotDataForCategoryIndex = createSelectorForCategoryIndex(
  _getCategoryIndexAsMemoKey,
  getScatterPlotDataForCategoryIndex,
  (plotData) => {
    console.log(plotData)
    let size = 1000 // FIXME: magic number
    let res = 20 // FIXME: magic number
    let side = size/res
    let squares = []
    for (let i = 0; i <= res; i++){
      squares[i] = []
      for (let j = 0; j <= res; j++){
        squares[i][j] = {id:i+'_'+j,x:i,y:j,ids:[],zs:[]}
      }
    }
    plotData.data.forEach(datum=>{
      let x = Math.floor(datum.x/side)
      let y = Math.floor(datum.y/side)
      squares[x][y].ids.push(datum.id)
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

const _getMainPlotCategory = state => state.plots.byId['default'].cat
const createSelectorForMainPlotCategory = byIdSelectorCreator();

export const getCategoryListForMainPlot = createSelectorForMainPlotCategory(
  _getMainPlotCategory,
  (state) => getPlainCategoryListForFieldId(state,_getMainPlotCategory(state)),
  (list) => {
    console.log(list)
    return list
  }
)

const hexCorner = (center, radius, i) => {
  let angle_deg = 60 * i + 30
  let angle_rad = Math.PI / 180 * angle_deg
  return {
    cx:center.x + radius * Math.cos(angle_rad),
    cy:center.y + radius * Math.sin(angle_rad)
  }
}

const cube_to_axial = cube => {
  let q = cube.x
  let r = cube.z
  return {q, r}
}

const axial_to_cube = hex => {
  let x = hex.q
  let z = hex.r
  let y = -x-z
  return {x, y, z}
}

const cube_to_oddr = cube => {
  let i = cube.x + (cube.z - (cube.z&1)) / 2
  let j = cube.z
  return {i, j}
}

const oddr_to_cube = oddr => {
  let x = oddr.j - (oddr.i - (oddr.i&1)) / 2
  let z = oddr.i
  let y = -x-z
  return {x, y, z}
}

const hex_round = hex => {
  return {q:Math.round(hex.q),r:Math.round(hex.r)}
}

const pixel_to_hex = (x, y, radius) => {
  let q = (x * Math.sqrt(3)/3 - y / 3) / radius
  let r = y * 2/3 / radius
  return hex_round({q, r})
}

const pixel_to_oddr = (x, y, radius) => {
  return cube_to_oddr(axial_to_cube(pixel_to_hex(x, y, radius)))
}

const drawPoints = (i,j,radius,res,scale = 1) => {
  let center
  let height = radius
  let width = Math.sqrt(3) * radius
  let corners = [0,1,2,3,4,5]
  if (j%2 == 0){
    center = {x:(i)*width,y:(j)*height*(3/2)}
  }
  else if (i < res) {
    center = {x:(i)*width+width/2,y:(j)*height*(3/2)}
  }
  if (center){
    radius = radius * scale
    let vertices = corners.map(i=>hexCorner(center,radius,i))
    let points = vertices.map(v=>v.cx+','+v.cy).join(' ')
    return points
  }
  return
}

const getHexGrid = createSelector(
  _getMainPlotCategory,
  () => {
    let size = 1000 // FIXME: magic number
    let res = 20 // FIXME: magic number
    let radius = (size/res)*(Math.sqrt(3)/3)
    let height = radius
    let width = Math.sqrt(3) * radius
    let hexes = []
    for (let i = 0; i <= res; i++){
      hexes[i] = []
      for (let j = 0; j <= res*1.2; j++){
        let points = drawPoints(i,j,radius,res)
        if (points) hexes[i][j] = {id:i+'_'+j,x:i,y:j,points}
      }
    }
    let data = [];
    for (let i = 0; i <= res; i++){
      for (let j = 0; j <= res*1.2; j++){
        if (hexes[i][j]) data.push(hexes[i][j])
      }
    }
    return { data,size,res,radius,height,width }
  }
)

export const getHexBinPlotDataForCategoryIndex = createSelectorForCategoryIndex(
  _getCategoryIndexAsMemoKey,
  getScatterPlotDataForCategoryIndex,
  getHexGrid,
  (plotData, grid) => {
    let hexes = []
    grid.data.forEach(d=>{
      hexes[d.x] = hexes[d.x] || []
      hexes[d.x][d.y] = {id:d.id,x:d.x,y:d.y,ids:[],zs:[]}
    })
    plotData.data.forEach(datum=>{
      let coords = pixel_to_oddr(datum.x,datum.y,grid.radius)
      if (hexes[coords.i] && hexes[coords.i][coords.j]){
        hexes[coords.i][coords.j].ids.push(datum.id)
        hexes[coords.i][coords.j].zs.push(datum.z)
      }
    })
    let data = [];
    for (let x = 0; x < hexes.length; x++){
      for (let y = 0; y < hexes[x].length; y++){
        if (hexes[x][y] && hexes[x][y].ids.length > 0){
          let scale = Math.log(hexes[x][y].zs.reduce((a,b)=>a+b))/15
          // let scale = Math.log(Math.max(...hexes[x][y].zs))/8
          hexes[x][y].points = drawPoints(x,y,grid.radius,grid.res,scale)
          // hexes[x][y].points = drawPoints(x,y,grid.radius,grid.res)
          data.push(hexes[x][y])
        }
      }
    }
    console.log(data)
    return {data,color:plotData.color}
  }
);
