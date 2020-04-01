import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import { byIdSelectorCreator } from './selectorCreators'
import { getDatasetID } from './location'
import { getCatAxis } from './plot';
import { format as d3Format } from 'd3-format'
import { getBinsForCat, getDetailsForFieldId } from './field'
import { getRawDataForLength, getLinks } from './summary'
import { getIdentifiers } from './identifiers'
import { getColorPalette } from '../reducers/color'
import store from '../store'

const apiUrl = API_URL || '/api/v1'

export const setCurrentRecord = createAction('SET_CURRENT_RECORD')

export const chooseCurrentRecord = (id) => {
  return async function (dispatch) {
    let state = store.getState()
    let currentRecord = getCurrentRecord(state)
    // if (id == currentRecord) return
    if (typeof(id) != 'undefined'){
      let datasetId = getDatasetID(state)
      let cat = getCatAxis(state)
      let details = getDetailsForFieldId(state, cat + '_positions')
      let headers = details.meta && details.meta.headers ? details.meta.headers : []
      let url = apiUrl + '/field/' + datasetId + '/' + cat + '_positions/' + id
      let response = await fetch(url);
      let json = await response.json();
      if (details.meta && details.meta.linked_field){
        let linked_url = apiUrl + '/field/' + datasetId + '/' + details.meta.linked_field + '/' + id
        let linked_response = await fetch(linked_url);
        let linked_json = await linked_response.json();
        if (linked_json.hasOwnProperty('values')){
          linked_json = linked_json.values
        }
        let linked_details = getDetailsForFieldId(state, details.meta.linked_field)
        headers = headers.concat(linked_details.meta.headers)
        json.values[0].forEach((arr,i)=>{
          json.values[0][i] = arr.concat(linked_json[0][i])
        })
      }
      let category_slot = details.meta && details.meta.category_slot ? details.meta.category_slot : 0
      dispatch(setCurrentRecord({id,...json,category_slot,headers}))
    }
    else {
      dispatch(setCurrentRecord({id}))
    }
  }
}

export const currentRecord = handleAction(
  'SET_CURRENT_RECORD',
  (state, action) => (
    action.payload
  ),
  {values:[[]],id:false}
)

export const getCurrentRecord = state => state.currentRecord

const getCatBinIndices = createSelector(
  getBinsForCat,
  bins => {
    let keys = {}
    bins.forEach((bin,i)=>{
      bin.keys.forEach(key=>{
        keys[key] = bin.id
      })
    })
    return keys
  }
)

const generateLink = (link, obj) => {
  let title, url, meta
  let ret = link.func(obj)
  if (ret.hasOwnProperty('title')){
    title = ret.title
    url = ret.url
  }
  else {
    title = link.title
    url = ret
  }
  return {title, url, meta: obj}

}

const chunkSize = (value) => {
    let mag = Math.floor(Math.log10(value))
    let first = Number(String(value).substring(0, 2)) + 1
    return first * Math.pow(10, mag-1)
}

export const getCategoryDistributionForRecord = createSelector(
  getCurrentRecord,
  getRawDataForLength,
  getCatBinIndices,
  getIdentifiers,
  getLinks,
  getColorPalette,
  (data,lengths,bins,identifiers,links, colors) => {
    if (!data || !data.values || typeof(data.id) == 'undefined') return false
    let yLimit = 0
    let binSize = 100000
    let xLimit = lengths.values[data.id]
    if (10 * binSize < xLimit){
      binSize = chunkSize(xLimit / 10)
    }
    let labels = {}
    let other = false
    let offsets = {}
    let sets = {}
    let id = identifiers[data.id]
    let cat_i = data.category_slot
    if (Array.isArray(cat_i)){
      cat_i = cat_i[0]
    }
    let other_key = Object.keys(bins).find(k => bins[k] === 'other');
    if (!other_key){
      other_key = 1+1*Math.max(...Object.keys(bins))
    }
    let start_i = data.headers.indexOf('start')
    let end_i = data.headers.indexOf('end')
    let score_i = data.headers.indexOf('score')
    let lines = data.values[0].map((hit,i)=>{
      let points = {}
      let center = (hit[start_i] + hit[end_i]) / 2
      let width = hit[end_i] - hit[start_i]
      points.x1 = center
      points.x2 = points.x1
      let bin = Math.floor(hit[start_i]/binSize)*binSize
      let offset = offsets[bin] || 0
      let previous = sets[bin]
      sets[bin] = i
      offsets[bin] = hit[score_i] + offset
      if (offsets[bin] > yLimit) yLimit = offsets[bin]
      points.y1 = offsets[bin]
      points.y2 = offset
      points.width = width
      points.cat = hit[cat_i]
      points.previous = previous
      points.link = {}
      let obj = {}
      data.headers.forEach((header,i)=>{
        obj[header] = hit[i]
      })
      if (data.keys){
        obj.taxon = data.keys[hit[cat_i]]
      }
      if (links.position){
        if (links.position[0]){
          if (obj.index !== undefined && links.position[obj.index] !== undefined){
            points.link = generateLink(links.position[obj.index], obj)
          }
          else {
            points.link = generateLink(links.position[0], obj)
          }
        }
        else {
          points.link = generateLink(links.position, obj)
        }
      }
      else if (data.keys){
        points.link = {meta: obj}
      }
      if (!labels[hit[cat_i]]){
        if (bins[hit[cat_i]]){
          if (bins[hit[cat_i]] == 'other'){
            if (!other){
              labels[hit[cat_i]] = bins[hit[cat_i]]
            }
            other = true
          }
          else {
            labels[hit[cat_i]] = bins[hit[cat_i]]
          }
        }
        else {
          labels[other_key] = 'other'
          other = true
        }
      }
      return points
    })
    return {lines,yLimit,xLimit,labels,id,otherColor:colors.colors[9],binSize}
  }
)

export const recordReducers = {
  currentRecord
}
