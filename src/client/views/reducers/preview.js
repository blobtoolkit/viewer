import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import { byIdSelectorCreator } from './selectorCreators'
import immutableUpdate from 'immutable-update';
import deep from 'deep-get-set'
import store from '../store'
import { getDetailsForFieldId,
  getRawDataForFieldId,
  getBinsForFieldId } from './field'
import { getDimensionsbyDimensionId } from './dimension'
import { getFilteredList, updateFilterList } from './filter'
import { getSelectedDatasetMeta } from './dataset'
import { getColorPalette } from './color'
import { getMainPlot } from './plot'
import * as d3 from 'd3'
import { getQueryValue, queryValue } from './history'


const createSelectorForFilterId = byIdSelectorCreator();
const _getFilterIdAsMemoKey = (state, filterId) => filterId
const getMetaDataForFilter = (state, filterId) => state.filters ? state.filters.byId[filterId] : {};

export const getDetailsForFilterId = createSelectorForFilterId(
  _getFilterIdAsMemoKey,
  getMetaDataForFilter,
  getDetailsForFieldId,
  getBinsForFieldId,
  (filterMeta = {}, fieldMeta = {}, bins) => {
    let obj = {
      filterId: filterMeta.id
    }
    if (fieldMeta.meta.type == 'variable'){
      obj.filterType = 'range'
      let range = fieldMeta.range ? fieldMeta.range.slice(0) : [1,10]
      range = [1*queryValue('min'+filterMeta.id) || range[0],1*queryValue('max'+filterMeta.id) || range[1]]
      obj.filterRange = filterMeta.range ? filterMeta.range.slice(0) : range
      obj.filterLimit = range
      obj.xScale = fieldMeta.xScale
    }
    if (fieldMeta.meta.type == 'category'){
      obj.filterType = 'category'
      obj.keys = filterMeta.keys
      obj.toggled = []
      if (obj.keys.length > 0){
        bins.forEach((bin,i)=>{
          obj.toggled[i] = bin.keys.some(key =>{
            return obj.keys.indexOf(key) != -1
          })
        })
      }
      else {
        obj.toggled = filterMeta.toggled
      }
    }
    if (fieldMeta.meta.type == 'selection'){
      obj.filterType = 'selection'
    }
    obj.clonedFrom = fieldMeta.clonedFrom
    obj.invert = filterMeta.invert
    return obj
  }
);

const createFilteredDataSelectorForFieldId = byIdSelectorCreator();
const _getFieldIdAsMemoKey = (state, fieldId) => fieldId;
//const getFilteredList = (state) => state.filteredList;

export const getFilteredDataForFieldId = createFilteredDataSelectorForFieldId(
  _getFieldIdAsMemoKey,
  getFilteredList,
  getRawDataForFieldId,
  (list = [], rawData = {}) => {
    let values = []
    if (rawData.values){
      let raw = rawData.values;
      let len = list.length
      for (var i = 0; i < len; i++){
        values.push(raw[list[i]]);
      }
    }
    return {values,keys:rawData.keys}
  }
);

const createFilteredBarSelectorForFieldId = byIdSelectorCreator();

export const getFilteredBarsForFieldId = createFilteredBarSelectorForFieldId(
  _getFieldIdAsMemoKey,
  getFilteredDataForFieldId,
  getBinsForFieldId,
  getDetailsForFieldId,
  (state) => getDimensionsbyDimensionId(state,'preview'),
  (data, fieldBins = [], details = {}, dimensions) => {
    let bars = []
    if (data){
      let x = details.xScale
      let bins = []
      if (details.meta.type == 'variable'){
        x.range([0,25])
        let thresh = Array.from(Array(24).keys()).map((n)=>{return x.invert((n+1))});
        bins = d3.histogram()
            .domain(x.domain())
            .thresholds(thresh)
            (data.values);
      }
      if (details.meta.type == 'category'){
        let nested = d3.nest()
          .key(d => data.keys[d])
          .rollup(d => d.length)
          .entries(data.values)
        fieldBins.forEach((obj,i) => {
          let index = nested.findIndex(n => obj.id == n.key)
          if (index > -1){
            bins[i] = {id:obj.id,x0:i,x1:i+1,length:nested[index].value}
          }
          else {
            bins[i] = {id:obj.id,x0:i,x1:i+1,length:0}
          }
        })
        if (nested.length > 10){
          let sortedSum = bins.map(a=>a.length).reduce((a,b)=> a + b)
          let nestedSum = nested.map(a=>a.value).reduce((a,b)=> a + b)
          let other = nestedSum - sortedSum
          bins[9].length = nestedSum - sortedSum
        }
      }

      let y = d3.scaleLinear()
          .domain([0, d3.max(fieldBins, function(d) { return d.length; })])
          .range([dimensions.height, 0]);
      if (details.meta.type == 'category'){
        x = d3.scaleLinear()
        x.domain([0,10]);
        y = d3.scaleSqrt()
              .domain([0, d3.max(fieldBins, function(d) { return d.length; })])
              .range([dimensions.height, 0]);
      }
      x.range([0,dimensions.width])
      bins.forEach((d,i)=>{
        bars.push({
          id:d.id || i,
          x:x(d.x0),
          y:y(d.length),
          width:x(d.x1) - x(d.x0) -1,
          height:(dimensions.height - y(d.length)) || 0
        })
      })

    }
    return bars
  }
);

const createPlainCategoryListSelectorForFieldId = byIdSelectorCreator();
export const getPlainCategoryListForFieldId = createPlainCategoryListSelectorForFieldId(
  _getFieldIdAsMemoKey,
  _getFieldIdAsMemoKey,
  getBinsForFieldId,
  getColorPalette,
  getMainPlot,
  (fieldId, bins = [], palette, plot) => {
    bins.forEach((b,i)=>{
      b.color = fieldId == plot.axes.cat ? palette.colors[i] : 'rgb(215, 205, 204)'
    })
    return {bins,plot}
  }
);


const createCategoryListSelectorForFieldId = byIdSelectorCreator();

export const getCategoryListForFieldId = createCategoryListSelectorForFieldId(
  _getFieldIdAsMemoKey,
  getBinsForFieldId,
  getDetailsForFilterId, // FIXME
  getColorPalette,
  getMainPlot,
  (bins = [], filter = {}, palette, plot) => {
    let matchId = filter.filterId
    // let matchId = filter.clonedFrom || filter.filterId
    bins.forEach((b,i)=>{
      b.toggled = filter.toggled[i]
      b.color = plot.axes.cat == matchId ? palette.colors[i] : 'rgb(215, 205, 204)'
      // b.color =  plot.axes.cat.match(filter.filterID) ? palette.colors[i] : 'rgb(215, 205, 204)'
    })
    return {bins,filter,plot}
  }
);

export const getFilteredSummary = createSelector(
  getSelectedDatasetMeta,
  getFilteredList,
  (meta = {}, list = []) => {
    let toPercent = d3.format(",.1%")
    return {
      count: meta.records || 0,
      type: meta.record_type || '',
      selected: list.length || 0,
      percentage: toPercent((list.length / meta.records) || 0)
    }
  }
)
//
// const filterRangeToList = (low,high,arr,list,invert) => {
//   let ret = []
//   let len = list.length
//   for (var i = 0; i < len; i++){
//     if (invert){
//       if (arr[list[i]] < low || arr[list[i]] > high){
//         ret.push(list[i]);
//       }
//     }
//     else {
//       if (arr[list[i]] >= low && arr[list[i]] <= high){
//         ret.push(list[i]);
//       }
//     }
//   }
//   return ret
// }
//
// const filterCategoriesToList = (keys,arr,list,invert) => {
//   let ret = []
//   let len = list.length
//   for (var i = 0; i < len; i++){
//     if (invert){
//       if (keys.includes(arr[list[i]])){
//         ret.push(list[i]);
//       }
//     }
//     else {
//       if (!keys.includes(arr[list[i]])){
//         ret.push(list[i]);
//       }
//     }
//
//   }
//   return ret
// }
//
// const filterArrayToList = (arr,list) => {
//   let ret = []
//   let a=0, l=0;
//   while (a < arr.length && l < list.length){
//     if (arr[a] < list[l] ){
//       a++
//     }
//     else if (arr[a] > list[l]){
//       l++
//     }
//     else {
//       ret.push(arr[a])
//       a++
//       l++
//     }
//   }
//   return ret
// }
//
// const filterArrayFromList = (arr,list) => {
//   let ret = []
//   let a=0, l=0;
//   while (a < arr.length && l < list.length){
//     if (arr[a] < list[l] ){
//       a++
//     }
//     else if (arr[a] > list[l]){
//       ret.push(list[l])
//       l++
//     }
//     else {
//       a++
//       l++
//     }
//   }
//   return ret
// }
//
// export function filterToList(readQueryString) {
//   return function(dispatch){
//     let state = store.getState();
//     let filters = state.filters.byId;
//     let fields = state.fields.byId;
//     let data = state.rawData.byId;
//     let count = state.availableDatasets.byId[state.selectedDataset].records
//     let list = fields['selection'].active ? state.selectedRecords.byDataset[state.selectedDataset] : undefined
//     let all = []
//     if (!list || list.length == 0 || filters['selection'].invert){
//       for (let i = 0; i < count; i++){
//         all.push(i)
//       }
//     }
//     if (!list || list.length == 0){
//       list = all
//     }
//     else if (fields['selection'].active && filters['selection'].invert){
//       list = filterArrayFromList(list,all)
//     }
//     state.filters.allIds.forEach(id => {
//       if (fields[id] && fields[id].active && filters[id]){
//         if (filters[id].type == 'range'){
//           let minstr = id+'--Min'
//           let maxstr = id+'--Max'
//           let invstr = id+'--Inv'
//           let range = filters[id].range
//           let limit = fields[id].range
//           let remove = []
//           let qmin = 1 * queryValue(minstr)
//           let qmax = 1 * queryValue(maxstr)
//           if (!shallow(range,limit)){
//             list = filterRangeToList(range[0],range[1],data[id].values,list,filters[id].invert)
//             let values = {}
//             if (range[0] > limit[0]){
//               values[minstr] = range[0]
//             }
//             else {
//               remove.push(minstr)
//             }
//             if (range[1] < limit[1]){
//               values[maxstr] = range[1]
//             }
//             else {
//               remove.push(maxstr)
//             }
//             if (filters[id].invert){
//               values[invstr] = true
//             }
//             else if (queryValue(invstr)){
//               values[invstr] = false
//             }
//             addQueryValues(values)
//           }
//           else {
//             remove.push(minstr)
//             remove.push(maxstr)
//           }
//           if (remove.length > 0){
//             removeQueryValues(remove)
//           }
//         }
//         else if (filters[id].type == 'list' || filters[id].type == 'category'){
//           //let data_id = filters[id].clonedFrom || id
//           if (data[id]){
//             list = filterCategoriesToList(filters[id].keys,data[id].values,list,filters[id].invert)
//             let keystr = id+'--Keys'
//             let invstr = id+'--Inv'
//             if (filters[id].keys.length > 0){
//               let bins = getBinsForFieldId(state,id)
//               let toggled = []
//               bins.forEach((bin,i)=>{
//                 toggled[i] = bin.keys.some(key =>{
//                   return filters[id].keys.indexOf(key) != -1
//                 })
//               })
//               console.log(filters[id].keys)
//               console.log(bins)
//               console.log(toggled)
//               dispatch(editFilter({id,toggled}))
//               let values = {}
//               values[keystr] = filters[id].keys.join()
//               if (filters[id].invert){
//                 values[invstr] = true
//               }
//               else {
//                 values[invstr] = false
//               }
//               addQueryValues(values)
//             }
//             else {
//               removeQueryValues([keystr,invstr])
//             }
//           }
//           //console.log(data_id)
//         }
//         // else if (filters[id].type == 'selection'){
//         //   list = filterArrayToList(filters[id].list,list)
//         // }
//       }
//     })
//     dispatch(updateFilterList(list))
//   }
// }
