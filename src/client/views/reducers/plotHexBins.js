import { createSelector } from 'reselect'
import { byIdSelectorCreator } from './selectorCreators'
import { getRawDataForFieldId, getDetailsForFieldId } from './field';
import { getBinsForFieldId } from './field';
import { getFilteredDataForFieldId } from './preview'
import { getMainPlot } from './plot';
import { getScatterPlotData } from './plotData';
import { getZReducer, getZScale, getPlotResolution } from './plotParameters';
import { getColorPalette } from './color';
import { drawPoints, pixel_to_oddr } from './hexFunctions'
import * as d3 from 'd3'
import immutableUpdate from 'immutable-update';

export const getHexGrid = createSelector(
  getPlotResolution,
  (res) => {
    let size = 1000 // FIXME: magic number
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
    let plotData = {id:mainPlot.id,axes:{},meta:{}};
    plotData.axes.x = xData || {values:[]}
    plotData.meta.x = xMeta
    plotData.axes.y = yData || {values:[]}
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
  (plotData) => {
    console.log(plotData)
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
      scales[axis].range([0,1000])
    })
    let len = plotData.axes.x.values.length
    for (let i = 0; i < len; i++){
      data.push({
        id:i,
        x: scales.x(plotData.axes.x.values[i]),
        y: 1000 - scales.y(plotData.axes.y.values[i]),
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
      hexes[d.x][d.y] = {id:d.id,x:d.x,y:d.y,ids:[],zs:[]}
    })
    scatterData.data.forEach(datum=>{
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
          // let scale = Math.log(hexes[x][y].zs.reduce((a,b)=>a+b))/15
          // hexes[x][y].points = drawPoints(x,y,grid.radius,grid.res,scale)
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
      let z = d.zs.reduce(reducer)
      min = Math.min(min,z)
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
      hexes[d.x][d.y] = {id:d.id,x:d.x,y:d.y,ids:[],zs:[]}
    })
    scatterData.data.forEach(datum=>{
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
          let z = zScale(hexes[x][y].zs.reduce(reducer))
          // let scale = Math.log(Math.max(...hexes[x][y].zs))/8
          hexes[x][y].points = drawPoints(x,y,grid.radius,grid.res,z/grid.radius)
          // hexes[x][y].points = drawPoints(x,y,grid.radius,grid.res)
          data.push(hexes[x][y])
        }
      }
    }
    return {data};
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
          zs:[]
        }
      })
      hex.ids.forEach((id,i) => {
        let currentCell = hexData[keys[categories.values[id]]]
        currentCell.ids.push(id)
        currentCell.zs.push(hex.zs[i])
        currentCell.z = zScale(currentCell.zs.reduce(reducer))
        currentCell.points = drawPoints(currentCell.x,currentCell.y,grid.radius,grid.res,currentCell.z/grid.radius)
      })
      hexData.sort((a,b)=>b.z - a.z)
      data = data.concat(hexData)
    })
    return {data};
  }
)
