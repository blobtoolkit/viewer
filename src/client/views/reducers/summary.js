import { createSelector } from 'reselect'
import { byIdSelectorCreator } from './selectorCreators'
import { getSelectedRecordsAsObject } from './select'
import { getScatterPlotDataByCategory,
  getMainPlotData,
  getScatterPlotData
} from './plotData';
import { getRawDataForFieldId, getDetailsForFieldId, getBinsForFieldId } from './field'
import { getMainPlot } from './plot';
import { getZReducer, getZScale, zReducers } from './plotParameters';
import { getColorPalette } from './color';
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
    return {byCat,selByCat,selAll,zAxis,bins,catKeys};
  }
)

export const getSummary = createSelector(
  getScatterPlotData,
  getSelectedScatterPlotDataByCategory,
  getZReducer,
  getColorPalette,
  (state) => getRawDataForFieldId(state,getMainPlot(state).axes.cat),
  (all,selected,reducer,palette,raw) => {
    let bins = selected.bins
    let zAxis = selected.zAxis
    let values = {counts:{},reduced:{},n50:{}}
    values.reduced.all = reducer.func(all.data.map(d=>d.z))
    values.reduced.sel = selected.selAll ? reducer.func(selected.selAll) : 0
    if (zAxis == 'length'){
      values.n50.all = zReducers.n50(all.data.map(d=>d.z))
      values.n50.sel = selected.selAll ? zReducers.n50(selected.selAll) : 0
      values.n50.binned = []
      values.n50.selBinned = []
    }
    values.counts.sel = selected.selAll ? selected.selAll.length : 0
    values.reduced.binned = []
    values.reduced.selBinned = []
    values.counts.binned = []
    values.counts.selBinned = []
    let other = []
    if (bins){
      bins.forEach((bin,i) => {
        values.reduced.binned[i] = reducer.func(selected.byCat[i])
        values.reduced.selBinned[i] = selected.selAll ? reducer.func(selected.selByCat[i]) : 0
        if (zAxis == 'length'){
          values.n50.binned[i] = zReducers.n50(selected.byCat[i])
          values.n50.selBinned[i] = selected.selAll ? zReducers.n50(selected.selByCat[i]) : 0
        }
        values.counts.binned[i] = selected.byCat[i].length
        values.counts.selBinned[i] = selected.selAll ? selected.selByCat[i].length : 0
      })
      if (bins[9] && bins[9].id == 'other'){
        bins[9].keys.forEach((index) => {
          other.push(raw.keys[index])
        })
        other = other.sort((a,b)=>{
          if(a < b) return -1
          if(a > b) return 1
          return 0
        })
      }
    }
    return { values,zAxis,bins,palette,other,reducer:reducer.id }
  }
)
