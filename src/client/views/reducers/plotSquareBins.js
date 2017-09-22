import { createSelector } from 'reselect'
import { byIdSelectorCreator } from './selectorCreators'
import { getRawDataForFieldId, getDetailsForFieldId } from './field';
import { getBinsForFieldId } from './field';
import { getFilteredDataForFieldId } from './preview'
import { getMainPlot } from './plot';
import { getScatterPlotData } from './plotData';
import { getAllScatterPlotData } from './plotHexBins';
import { getZReducer, getZScale, getPlotResolution } from './plotParameters';
import { getColorPalette } from './color';
import * as d3 from 'd3'
import immutableUpdate from 'immutable-update';

export const getSquareGrid = createSelector(
  getPlotResolution,
  (res) => {
    let size = 1000 // FIXME: magic number
    let height = size/res
    let width = height
    let data = []
    for (let i = 0; i <= res; i++){
      for (let j = 0; j <= res; j++){
        data.push({id:i+'_'+j,i,j,x:i*width,y:j*height,height,width})
      }
    }
    return { data,size,res,height,width }
  }
)

export const getAllScatterPlotDataBySquareBin = createSelector(
  getSquareGrid,
  getAllScatterPlotData,
  (grid,scatterData) => {
    let squares = []
    grid.data.forEach(d=>{
      squares[d.i] = squares[d.i] || []
      squares[d.i][d.j] = {id:d.id,i:d.i,j:d.j,ids:[],zs:[]}
    })
    scatterData.data.forEach(datum=>{
      let coords = [Math.floor(datum.x/grid.width),Math.floor(datum.y/grid.height)]
      if (squares[coords[0]] && squares[coords[0]][coords[1]]){
        squares[coords[0]][coords[1]].ids.push(datum.id)
        squares[coords[0]][coords[1]].zs.push(datum.z)
      }
    })
    let data = [];
    for (let i = 0; i < squares.length; i++){
      for (let j = 0; j < squares[i].length; j++){
        if (squares[i][j] && squares[i][j].ids.length > 0){
          data.push(squares[i][j])
        }
      }
    }
    return {data};
  }
)

export const getOccupiedSquareGrid = createSelector(
  getSquareGrid,
  getAllScatterPlotDataBySquareBin,
  getZReducer,
  (grid,binned,reducer) => {
    let data = []
    let min = Number.POSITIVE_INFINITY
    let max = Number.NEGATIVE_INFINITY
    binned.data.forEach(d => {
      let index = grid.data.findIndex(o => o.id === d.id)
      data.push({id:d.id,i:d.i,j:d.j,x:grid.data[index].x,y:grid.data[index].y,width:grid.width,height:grid.height})
      let len = d.zs.length
      for (let i = 0; i < len; i++){
        if (d.zs[i] < min) min = d.zs[i]
      }
      let z = reducer(d.zs)
      max = Math.max(max,z)
    })
    let range = [min,max]
    let newGrid = immutableUpdate(grid,{data,range})
    return newGrid;
  }
)

export const getScatterPlotDataBySquareBin = createSelector(
  getOccupiedSquareGrid,
  getScatterPlotData,
  getZReducer,
  getZScale,
  (grid,scatterData,reducer,scale) => {
    let zScale = d3[scale]().domain(grid.range).range([0,grid.width])
    let squares = []
    grid.data.forEach(d=>{
      squares[d.i] = squares[d.i] || []
      squares[d.i][d.j] = {id:d.id,i:d.i,j:d.j,ids:[],zs:[]}
    })
    scatterData.data.forEach(datum=>{
      let coords = [Math.floor(datum.x/grid.width),Math.floor(datum.y/grid.height)]
      if (squares[coords[0]] && squares[coords[0]][coords[1]]){
        squares[coords[0]][coords[1]].ids.push(datum.id)
        squares[coords[0]][coords[1]].zs.push(datum.z)
      }
    })
    let data = [];
    for (let i = 0; i < squares.length; i++){
      if (squares[i]){
        for (let j = 0; j < squares[i].length; j++){
          if (squares[i][j] && squares[i][j].zs.length > 0){
            let z = zScale(reducer(squares[i][j].zs))
            let offset = (grid.width - z) / 2
            let index = grid.data.findIndex(o => o.id === squares[i][j].id)
            squares[i][j].x = grid.data[index].x + offset
            squares[i][j].y = grid.data[index].y + offset
            squares[i][j].width = grid.width - offset * 2
            squares[i][j].height = squares[i][j].width
            data.push(squares[i][j])
          }
        }
      }
    }
    return {data};
  }
)


export const getScatterPlotDataBySquareBinByCategory = createSelector(
  getOccupiedSquareGrid,
  getScatterPlotDataBySquareBin,
  (state) => getBinsForFieldId(state,getMainPlot(state).axes.cat),
  (state) => getFilteredDataForFieldId(state,getMainPlot(state).axes.cat),
  getColorPalette,
  getZReducer,
  getZScale,
  (grid,scatterData,bins,categories,palette,reducer,scale) => {
    console.time('getScatterPlotDataBySquareBinByCategory');
    let zScale = d3[scale]().domain(grid.range).range([0,grid.width])
    let keys = {}
    let data = []
    if (bins.length == 0) return scatterData
    bins.forEach((bin,i)=>{
      bin.keys.forEach(key=>{
        keys[key] = i
      })
    })
    let byCat = []
    scatterData.data.forEach((square)=>{
      let squareData = []

      bins.forEach((bin,i)=>{
        squareData[i] = {
          id:square.id+'_'+i,
          cellId:square.id,
          i:square.i,
          j:square.j,
          color:palette.colors[i],
          ids:[],
          zs:[]
        }
      })
      square.ids.forEach((id,i) => {
        let currentCell = squareData[keys[categories.values[id]]]
        currentCell.ids.push(id)
        currentCell.zs.push(square.zs[i])
      })
      let squareArray = squareData.filter(obj => obj.ids.length > 0);
      squareArray.forEach(s=>{
        s.z = zScale(reducer(s.zs))
        let offset = (grid.width - s.z) / 2
        let index = grid.data.findIndex(o => o.id === s.cellId)
        s.x = grid.data[index].x + offset
        s.y = grid.data[index].y + offset
        s.width = grid.width - offset * 2
        s.height = s.width
      })
      data = data.concat(squareArray.sort((a,b)=>b.z - a.z))
    })


    console.timeEnd('getScatterPlotDataBySquareBinByCategory');
    return {data};
  }
)
