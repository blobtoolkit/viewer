import { createSelector } from 'reselect'
import { byIdSelectorCreator } from './selectorCreators'
import { getRawDataForFieldId, getDetailsForFieldId } from './field';
import { getBinsForFieldId } from './field';
import { getFilteredDataForFieldId } from './preview'
import { getMainPlot } from './plot';
import { getSelectedRecordsAsObject } from './select';
import { getMainPlotData, getScatterPlotData } from './plotData';
import { getZReducer, getZScale, getPlotResolution, getTransformFunction } from './plotParameters';
import { getColorPalette } from './color';
import { drawPoints, pixel_to_oddr } from './hexFunctions'
import * as d3 from 'd3'
import immutableUpdate from 'immutable-update';

export const getHexGrid = createSelector(
  getPlotResolution,
  (res) => {
    let size = 900.1 // FIXME: magic number
    let width = size / res
    let jres = res * 3 / Math.sqrt(3)
    let radius = width / Math.sqrt(3)
    let height = radius * 2
    let data = [];
    for (let i = 0; i <= res; i++){
      for (let j = 0; j <= jres; j++){
        let points = drawPoints(i,j,radius,res)
        if (points) data.push({id:i+'_'+j,x:i,y:j,points})
      }
    }
    return { data,size,res,radius,height,width }
  }
)

export const getAllMainPlotData = createSelector(
  getMainPlot,
  getMainPlotData,
  (state) => getRawDataForFieldId(state,getMainPlot(state).axes.x),
  (state) => getRawDataForFieldId(state,getMainPlot(state).axes.y),
  (state) => getRawDataForFieldId(state,getMainPlot(state).axes.z),
  (state) => getRawDataForFieldId(state,getMainPlot(state).axes.cat),
  (state) => getDetailsForFieldId(state,getMainPlot(state).axes.x),
  (state) => getDetailsForFieldId(state,getMainPlot(state).axes.y),
  (state) => getDetailsForFieldId(state,getMainPlot(state).axes.z),
  (state) => getDetailsForFieldId(state,getMainPlot(state).axes.cat),
  (mainPlot,visibleData,xData,yData,zData,catData,xMeta,yMeta,zMeta,catMeta) => {
    let plotData = {id:mainPlot.id,axes:{},meta:{}};
    plotData.axes.x = xData || {values:[]}
    xMeta.xScale = visibleData.meta.x.xScale.copy()
    plotData.meta.x = xMeta
    plotData.axes.y = yData || {values:[]}
    yMeta.xScale = visibleData.meta.y.xScale.copy()
    plotData.meta.y = yMeta
    plotData.axes.z = zData || {values:[]}
    plotData.meta.z = zMeta
    plotData.axes.cat = catData
    plotData.meta.cat = catMeta
    return plotData;
  }
);

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
      scales[axis] = plotData.meta[axis].xScale.copy();
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

export const getAllScatterPlotDataByHexBin = createSelector(
  getHexGrid,
  getAllScatterPlotData,
  (grid,scatterData) => {
    let hexes = []
    grid.data.forEach(d=>{
      hexes[d.x] = hexes[d.x] || []
      hexes[d.x][d.y] = {id:d.id,x:d.x,y:d.y,ids:[],zs:[],indices:[]}
    })
    scatterData.data.forEach(datum=>{
      let coords = pixel_to_oddr(datum.x,datum.y,grid.radius)
      if (hexes[coords.i] && hexes[coords.i][coords.j]){
        hexes[coords.i][coords.j].ids.push(datum.id)
        hexes[coords.i][coords.j].indices.push(datum.index)
        hexes[coords.i][coords.j].zs.push(datum.z)
      }
    })
    let data = [];
    for (let x = 0; x < hexes.length; x++){
      for (let y = 0; y < hexes[x].length; y++){
        if (hexes[x][y] && hexes[x][y].ids.length > 0){
          data.push(hexes[x][y])
        }
      }
    }
    return {data};
  }
)

export const getOccupiedHexGrid = createSelector(
  getHexGrid,
  getAllScatterPlotDataByHexBin,
  getZReducer,
  (grid,binned,reducer = (a,b)=>{a+b}) => {
    let data = []
    let min = Number.POSITIVE_INFINITY
    let max = Number.NEGATIVE_INFINITY
    binned.data.forEach(d => {
      data.push({id:d.id,x:d.x,y:d.y,points:grid.data[grid.data.findIndex(o => o.id === d.id)].points})
      let len = d.zs.length
      for (let i = 0; i < len; i++){
        if (d.zs[i] < min) min = d.zs[i]
      }
      let z = reducer.func(d.zs)
      max = Math.max(max,z)
    })
    let range = [min,max]
    let newGrid = immutableUpdate(grid,{data,range})
    return newGrid;
  }
)


export const getScatterPlotDataByHexBin = createSelector(
  getOccupiedHexGrid,
  getScatterPlotData,
  getZReducer,
  getZScale,
  (grid,scatterData,reducer,scale) => {
    let zScale = d3[scale]().domain(grid.range).range([0,grid.radius])
    let hexes = []
    grid.data.forEach(d=>{
      hexes[d.x] = hexes[d.x] || []
      hexes[d.x][d.y] = {id:d.id,x:d.x,y:d.y,ids:[],zs:[],indices:[]}
    })
    scatterData.data.forEach(datum=>{
      let coords = pixel_to_oddr(datum.x,datum.y,grid.radius)
      if (hexes[coords.i] && hexes[coords.i][coords.j]){
        hexes[coords.i][coords.j].indices.push(datum.index)
        hexes[coords.i][coords.j].ids.push(datum.id)
        hexes[coords.i][coords.j].zs.push(datum.z)
      }
    })
    let data = [];
    for (let x = 0; x < hexes.length; x++){
      if (hexes[x]){
        for (let y = 0; y < hexes[x].length; y++){
          if (hexes[x][y] && hexes[x][y].ids.length > 0){
            let z = zScale(reducer.func(hexes[x][y].zs))
            z = z > 1 ? z : 1;
            hexes[x][y].points = drawPoints(x,y,grid.radius,grid.res,z/grid.radius)
            hexes[x][y].index = 0
            data.push(hexes[x][y])
          }
        }
      }
    }
    return {data,hexes,radius:grid.radius};
  }
)

// export const getOccupiedHexes = createSelector(
//   getScatterPlotDataByHexBin,
//   (grid) => {
//     let hexes = {}
//     grid.data.forEach(d=>{
//       hexes[d.x] = hexes[d.x] || {}
//       hexes[d.x][d.y] = {id:d.id,x:d.x,y:d.y,ids:[],zs:[],indices:[]}
//     })
//     return {hexes,radius:grid.radius};
//   }
// )

export const getSelectedHexGrid = createSelector(
  getOccupiedHexGrid,
  getSelectedRecordsAsObject,
  getScatterPlotDataByHexBin,
  (grid,records,scatterData) => {
    let data = []
    grid.data.forEach(cell => {
      let newCell = Object.assign({},cell)
      let index = scatterData.data.findIndex(o => o.id === cell.id)
      if (index != -1){
        newCell.ids = scatterData.data[index].ids
        let count = 0;
        let len = newCell.ids.length
        let i = 0
        for (let i = 0; i < len; i++){
          if (records[newCell.ids[i]]) count++
        }
        newCell.selected = count
      }
      else {
        newCell.ids = []
      }
      data.push(newCell)
    })
    let newGrid = immutableUpdate(grid,{data})
    return newGrid;
  }
)

export const getScatterPlotDataByHexBinByCategory = createSelector(
  getOccupiedHexGrid,
  getScatterPlotDataByHexBin,
  (state) => getBinsForFieldId(state,getMainPlot(state).axes.cat),
  (state) => getFilteredDataForFieldId(state,getMainPlot(state).axes.cat),
  getColorPalette,
  getZReducer,
  getZScale,
  (grid,scatterData,bins,categories,palette,reducer,scale) => {
    let zScale = d3[scale]().domain(grid.range).range([0,grid.radius])
    let keys = {}
    let data = []
    if (bins.length == 0) return scatterData
    bins.forEach((bin,i)=>{
      bin.keys.forEach(key=>{
        keys[key] = i
      })
    })
    let byCat = []
    scatterData.data.forEach((hex)=>{
      let hexData = []

      bins.forEach((bin,i)=>{
        hexData[i] = {
          id:hex.id+'_'+i,
          x:hex.x,
          y:hex.y,
          color:palette.colors[i],
          ids:[],
          zs:[],
          indices:[]
        }
      })
      hex.indices.forEach((index,i) => {
        let currentCell = hexData[keys[categories.values[index]]]
        currentCell.ids.push(hex.ids[i])
        currentCell.indices.push(index)
        currentCell.zs.push(hex.zs[i])
      })
      let hexArray = hexData.filter(obj => obj.ids.length > 0);
      hexArray.forEach(h=>{
        h.z = zScale(reducer.func(h.zs))
        h.z = h.z > 1 ? h.z : 1;
        h.points = drawPoints(h.x,h.y,grid.radius,grid.res,h.z/grid.radius)
      })
      data = data.concat(hexArray.sort((a,b)=>b.z - a.z))
    })
    return {data};
  }
)
