import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector, createSelectorCreator } from 'reselect'
import immutableUpdate from 'immutable-update';
import deep from 'deep-get-set'
import shallow from 'shallowequal'
import store from '../store'
import { getDetailsForFieldId,
  getRawDataForFieldId,
  getBinsForFieldId } from './field'
import { getDimensionsbyDimensionId } from './dimension'
import * as d3 from 'd3'

const createSelectorForFilterId = createSelectorCreator((resultFunc) => {
  const memoAll = {};
  return (filterId, ...args) => {
    if (!memoAll[filterId]) {
      memoAll[filterId] = {};
    }
    const memo = memoAll[filterId];
    if (!shallow(memo.lastArgs, args)) {
      memo.lastArgs = args;
      memo.lastResult = resultFunc(...args);
    }
    return memo.lastResult;
  };
});

const _getFilterIdAsMemoKey = (state, filterId) => filterId;
const getMetaDataForFilter = (state, filterId) => state.filters.byId[filterId];

export const getDetailsForFilterId = createSelectorForFilterId(
  _getFilterIdAsMemoKey,
  getMetaDataForFilter,
  getDetailsForFieldId,
  (filterMeta = {}, fieldMeta = {}) => {
    let obj = {
      filterId: filterMeta.id,
      filterType: 'range',
      filterRange: filterMeta.range ? filterMeta.range.slice(0) : fieldMeta.range ? fieldMeta.range.slice(0) : [1,10],
      filterLimit: fieldMeta.range ? fieldMeta.range.slice(0) : [1,10],
      xScale: fieldMeta.xScale
    }
    return obj
  }
);

const createFilteredDataSelectorForFieldId = createSelectorCreator((resultFunc) => {
  const memoAll = {};
  return (fieldId, ...args) => {
    if (!memoAll[fieldId]) {
      memoAll[fieldId] = {};
    }
    const memo = memoAll[fieldId];
    if (!shallow(memo.lastArgs, args)) {
      memo.lastArgs = args;
      memo.lastResult = resultFunc(...args);
    }
    return memo.lastResult;
  };
});

const _getFieldIdAsMemoKey = (state, fieldId) => fieldId;
const getFilteredList = (state) => state.filteredList;

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
    return values
  }
);

const createFilteredBarSelectorForFieldId = createSelectorCreator((resultFunc) => {
  const memoAll = {};
  return (fieldId, ...args) => {
    if (!memoAll[fieldId]) {
      memoAll[fieldId] = {};
    }
    const memo = memoAll[fieldId];
    if (!shallow(memo.lastArgs, args)) {
      memo.lastArgs = args;
      memo.lastResult = resultFunc(...args);
    }
    return memo.lastResult;
  };
});

export const getFilteredBarsForFieldId = createFilteredBarSelectorForFieldId(
  _getFieldIdAsMemoKey,
  getFilteredDataForFieldId,
  getBinsForFieldId,
  getDetailsForFieldId,
  (state) => getDimensionsbyDimensionId(state,'preview'),
  (data, fieldBins = [], details = {}, dimensions) => {
    let width = dimensions.width;
    let height = dimensions.height;
    let bars = []
    if (data){
      let x = details.xScale
      let thresh = Array.from(Array(24).keys()).map((n)=>{return x.invert((n+1)*width/25)});
      let bins = d3.histogram()
          .domain(x.domain())
          .thresholds(thresh)
          (data);
      let y = d3.scaleLinear()
          .domain([0, d3.max(fieldBins, function(d) { return d.length; })])
          .range([height, 0]);
      bins.forEach((d,i)=>{
        bars.push({
          id:i,
          x:x(d.x0),
          y:y(d.length),
          width:x(d.x1) - x(d.x0) -1,
          height:height - y(d.length)
        })
      })
    }
    return bars
  }
);

// var svg = d3.select(this.svg);
//
// var height = this.svg.clientHeight;
// var width = this.svg.clientWidth;
//
// var data = this.props.values;//d3.range(1000).map(d3.randomBates(10));
// var g = svg.append("g")
// var x = this.props.xScale;
// var thresh = Array.from(Array(24).keys()).map((n)=>{return x.invert((n+1)*width/25)});
// var bins = d3.histogram()
// .domain(x.domain())
// .thresholds(thresh)
// (data);
// var y = d3.scaleLinear()
// .domain([0, d3.max(bins, function(d) { return d.length; })])
// .range([height, 0]);
//
// var bar = g.selectAll('.'+styles.bar)
//     .data(bins)
//     .enter().append("g")
//       .attr("class", styles.bar)
//       .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });
//
// bar.append("rect")
//     .attr("x", 1)
//     .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ;})
//     .attr("height", function(d) { return height - y(d.length); });
