import { createSelector } from 'reselect'
import { byIdSelectorCreator } from './selectorCreators'
import { getSelectedRecordsAsObject } from './select'
import { getScatterPlotDataByCategory,
  getMainPlotData,
  getScatterPlotData
} from './plotData';
import { getDetailsForFieldId, getBinsForFieldId } from './field'
import { getMainPlot } from './plot';
import { getZReducer, getZScale } from './plotParameters';
import { getColorPalette } from './color';
import * as d3 from 'd3'
import immutableUpdate from 'immutable-update';


export const getSelectedScatterPlotDataByCategory = createSelector(
  getMainPlotData,
  getScatterPlotData,
  getSelectedRecordsAsObject,
  (state) => getMainPlot(state).axes.z,
  (state) => getBinsForFieldId(state,getMainPlot(state).axes.cat),
  (plotData,scatterData,selected,zAxis,bins) => {
    let byCat = [];
    let selByCat = [];
    let selAll = [];
    let catKeys = {}
    if (plotData.axes.x.values.length == 0 ||
        plotData.axes.y.values.length == 0 ||
        plotData.axes.z.values.length == 0 ||
        plotData.axes.cat.values.length == 0){
      return {data:[]}
    }
    bins.forEach((bin,i)=>{
      byCat[i] = []
      selByCat[i] = []
      bin.keys.forEach(key=>{
        catKeys[key] = i
      })
    })
    let cats = plotData.axes.cat
    let zs = plotData.axes.z
    let len = zs.values.length
    for (let i = 0; i < len; i++){
      byCat[catKeys[cats.values[i]]].push(
        zs.values[i]
      )
      if (selected[scatterData.data[i].id]){
        selByCat[catKeys[cats.values[i]]].push(
          zs.values[i]
        )
        selAll.push(zs.values[i])
      }
    }
    return {byCat,selByCat,selAll,zAxis,bins};
  }
)

export const getSummary = createSelector(
  getScatterPlotData,
  getSelectedScatterPlotDataByCategory,
  getZReducer,
  getColorPalette,
  (all,selected,reducer,palette) => {
    let bins = selected.bins
    let zAxis = selected.zAxis
    let values = {counts:{},reduced:{}}
    values.reduced.all = reducer.func(all.data.map(d=>d.z))
    values.reduced.sel = selected.selAll ? reducer.func(selected.selAll) : 0
    values.counts.all = all.data.length
    values.counts.sel = selected.selAll ? selected.selAll.length : 0
    values.reduced.binned = []
    values.reduced.selBinned = []
    values.counts.binned = []
    values.counts.selBinned = []
    if (bins){
      bins.forEach((bin,i) => {
        values.reduced.binned[i] = reducer.func(selected.byCat[i])
        values.reduced.selBinned[i] = selected.selAll ? reducer.func(selected.selByCat[i]) : 0
        values.counts.binned[i] = selected.byCat[i].length
        values.counts.selBinned[i] = selected.selAll ? selected.selByCat[i].length : 0
      })
    }
    return { values,zAxis,bins,palette }
  }
)
