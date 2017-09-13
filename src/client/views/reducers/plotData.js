import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector, createSelectorCreator } from 'reselect'
import { getMainPlot } from './plot';
import { getColorPalette } from './color';
import { getFilteredDataForFieldId } from './preview'
import { getDetailsForFieldId, getBinsForFieldId } from './field'
import store from '../store'
import * as d3 from 'd3'
import cloneFunction from 'clone-function';

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
    for (let i = 0; i < len; i++){
      data.push({
        id:i,
        cx: scales.x(plotData.axes.x.values[i]),
        cy: 1000 - scales.y(plotData.axes.y.values[i]),
        r: scales.z(plotData.axes.z.values[i])
      })
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