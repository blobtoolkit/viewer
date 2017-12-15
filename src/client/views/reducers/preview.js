import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import { byIdSelectorCreator,
  linkIdToDataset } from './selectorCreators'
import immutableUpdate from 'immutable-update';
import deep from 'deep-get-set'
import store from '../store'
import { getDetailsForFieldId,
  getRawDataForFieldId,
  getBinsForFieldId } from './field'
import { getDimensionsbyDimensionId } from './dimension'
import { getFilteredList } from './filter'
import { getSelectedDatasetMeta } from './dataset'
import { getColorPalette } from './color'
import { getMainPlot } from './plot'
import * as d3 from 'd3'

const createSelectorForFilterId = byIdSelectorCreator();
const _getFilterIdAsMemoKey = (state, filterId) => linkIdToDataset(filterId);
const getMetaDataForFilter = (state, filterId) => state.filters ? state.filters.byId[linkIdToDataset(filterId)] : {};

export const getDetailsForFilterId = createSelectorForFilterId(
  _getFilterIdAsMemoKey,
  getMetaDataForFilter,
  getDetailsForFieldId,
  (filterMeta = {}, fieldMeta = {}) => {
    let obj = {
      filterId: filterMeta.id,
    }
    if (fieldMeta.meta.type == 'variable'){
      obj.filterType = 'range',
      obj.filterRange = filterMeta.range ? filterMeta.range.slice(0) : fieldMeta.range ? fieldMeta.range.slice(0) : [1,10],
      obj.filterLimit = fieldMeta.range ? fieldMeta.range.slice(0) : [1,10],
      obj.xScale = fieldMeta.xScale
    }
    if (fieldMeta.meta.type == 'category'){
      obj.filterType = 'category'
      obj.toggled = filterMeta.toggled,
      obj.keys = filterMeta.keys
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
