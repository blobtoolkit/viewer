import { createSelector } from 'reselect'
import { byIdSelectorCreator } from './selectorCreators'
import { getSelectedRecordsAsObject } from './select'
import { getScatterPlotDataByCategory,
  getMainPlotData,
  getScatterPlotData
} from './plotData';
import { getRawDataForFieldId, getDetailsForFieldId, getBinsForFieldId, getAllActiveFields } from './field'
import { getMainPlot } from './plot';
import { getSelectedDatasetMeta } from './dataset';
import { getFilteredList } from './filter';
import { getFilteredDataForFieldId } from './preview';
import { getZReducer, getZScale, zReducers } from './plotParameters';
import { getColorPalette } from './color';
import immutableUpdate from 'immutable-update';
import { scaleLinear as d3scaleLinear } from 'd3-scale';
import { line as d3Line } from 'd3-shape';
import { format as d3Format } from 'd3-format'
import { default as Simplify } from 'simplify-js'
import { getIdentifiersForList } from './list'

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
    values.counts.all = all.data.length
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

export const getCumulative = createSelector(
  getScatterPlotData,
  getSelectedScatterPlotDataByCategory,
  (all,selected) => {
    let zAxis = selected.zAxis
    let bins = selected.bins
    let values = {all:[],byCat:[]}
    let arr = all.data.map(d=>d.z)
    arr.sort((a,b)=>b-a)
    let tot = 0
    arr.forEach((z,i)=>{arr[i] += tot; tot += z})
    values.all = arr
    if (bins){
      bins.forEach((bin,i) => {
        let arr = selected.byCat[i].slice()
        arr.sort((a,b)=>b-a)
        let tot = 0
        arr.forEach((z,i)=>{arr[i] += tot; tot += z})
        values.byCat.push(arr)
      })
    }
    return { values,zAxis }
  }
)

export const cumulativeCurves = createSelector(
  getCumulative,
  getColorPalette,
  (cumulative,palette) => {
    let values = cumulative.values
    let all = values.all
    let byCat = values.byCat
    let zAxis = cumulative.zAxis
    let xScale = d3scaleLinear().range([50,950]).domain([0,all.length])
    let yScale = d3scaleLinear().range([950,50]).domain([0,all[all.length - 1]])
    let f = d3Format(".3f");
    let line = d3Line().x(d=>f(d.x)).y(d=>f(d.y))
    let xyScale = arr => [0].concat(arr).map((y,x)=>({x:xScale(x),y:yScale(y)}))
    let paths = {all:'',scaled:[],byCat:[],offsets:[],count_offsets:[]}
    // values.all = Simplify(scaled)
    let counts = byCat.map((arr,i)=>({i,l:arr.length}))
    let spans = byCat.map((arr,i)=>({i,l:arr[arr.length-1]}))
    let offset = {x:0,y:0}
    paths.scaled = byCat.map(arr=>xyScale(arr))
    spans.sort((a,b)=>b.l-a.l).forEach(o=>{
      paths.offsets[o.i] = {...offset}
      let scaled = paths.scaled[o.i]
      offset.x += scaled[scaled.length-1].x - 50
      offset.y += 950 - scaled[scaled.length-1].y
      paths.byCat[o.i] = line(Simplify(scaled,0.5))
    })
    offset = {x:0,y:0}
    counts.sort((a,b)=>b.l-a.l).forEach(o=>{
      paths.count_offsets[o.i] = {...offset}
      let scaled = paths.scaled[o.i]
      offset.x += scaled[scaled.length-1].x - 50
      offset.y += 950 - scaled[scaled.length-1].y
    })
    paths.all = line(Simplify(xyScale(all),0.5))
    // byCat.forEach((arr,i)=>{
    //   paths.byCat[i] = line(Simplify(xyScale(arr),0.5))
    // })
    return { values,paths,zAxis,palette }
  }
)

const funcFromPattern = pattern => {
  return (def) => {
    let url = ''
    let parts = pattern.split(/[\{\}]/)
    for (let i = 0; i < parts.length; i++){
      if (parts[i]){
        url += i % 2 == 0 ? parts[i] : def[parts[i]]
      }
    }
    return url
  }
}

export const getLinks = createSelector(
  getSelectedDatasetMeta,
  (meta) => {
    let links = {dataset:[],record:[]}
    if (meta.dataset_links){
      Object.keys(meta.dataset_links).forEach(title=>{
        let pattern = meta.dataset_links[title]
        links.dataset.push({title,func:funcFromPattern(pattern)})
      })
    }
    if (meta.record_links){
      Object.keys(meta.record_links).forEach(title=>{
        let pattern = meta.record_links[title]
        links.record.push({title,func:funcFromPattern(pattern)})
      })
    }
    return links
  }
)

export const getTableData = createSelector(
  getMainPlotData,
  getAllActiveFields,
  getSelectedRecordsAsObject,
  getFilteredList,
  (state) => {
    let data = {}
    Object.keys(getAllActiveFields(state)).forEach(field=>{
      data[field] = getFilteredDataForFieldId(state,field)
    })
    return data
  },
  (state) => {
    let bins = {}
    let fields = getAllActiveFields(state)
    Object.keys(fields).forEach(field=>{
      if (fields[field].type == 'category'){
        bins[field] = getBinsForFieldId(state,field)
      }
    })
    return bins
  },
  getIdentifiersForList,
  getLinks,
  (plotData,fields,selected,list,data,bins,identifiers,links) => {
    let values = []
    let keys = {}
    let plot = plotData.meta
    list.forEach((_id,index) => {
      let row = {sel:Boolean(selected[_id]),_id}
      Object.keys(fields).forEach(field=>{
        row[field] = data[field].values[index] || 0
      })
      if(identifiers[index]){
        row['id'] = identifiers[index]
      }
      values.push(row)
    })
    Object.keys(fields).forEach(field=>{
      if (data[field].keys){
        keys[field] = data[field].keys
      }
    })
    return {values,keys,plot,fields,links}
  }
)

export const getBinnedColors = createSelector(
  getColorPalette,
  (state) => getBinsForFieldId(state,getMainPlot(state).axes.cat),
  (palette,bins) => {
    let colors = []
    bins.forEach((bin,i) => {
      bin.keys.forEach(k=>{
        colors[k] = palette.colors[i]
      })
    })
    return colors
  }

)
