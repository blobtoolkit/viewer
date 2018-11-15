import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import { byIdSelectorCreator } from './selectorCreators'
import { getDatasetID } from './location'
import { getCatAxis } from './plot';
import { format as d3Format } from 'd3-format'
import { getBinsForCat } from './field'
import { getRawDataForLength } from './summary'
import { getIdentifiers } from './identifiers'
import store from '../store'

const apiUrl = API_URL || '/api/v1'

export const setCurrentRecord = createAction('SET_CURRENT_RECORD')

export const chooseCurrentRecord = (id) => {
  return async function (dispatch) {
    let state = store.getState()
    let currentRecord = getCurrentRecord(state)
    // if (id == currentRecord) return
    if (id){
      let datasetId = getDatasetID(state)
      let cat = getCatAxis(state)
      let url = apiUrl + '/field/' + datasetId + '/' + cat + '_positions/' + id
      let response = await fetch(url);
      let json = await response.json();
      dispatch(setCurrentRecord({id,...json}))
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

export const getCategoryDistributionForRecord = createSelector(
  getCurrentRecord,
  getRawDataForLength,
  getCatBinIndices,
  getIdentifiers,
  (data,lengths,bins,identifiers) => {
    if (!data || !data.values || !data.id) return false
    let yLimit = 0
    let binSize = 100000
    let labels = {}
    let offsets = {}
    let xLimit = lengths.values[data.id]
    let id = identifiers[data.id]
    let lines = data.values[0].map(hit=>{
      let points = {}
      let center = (hit[1] + hit[2]) / 2
      let width = hit[2] - hit[1]
      points.x1 = center
      points.x2 = points.x1
      let bin = Math.floor(hit[1]/binSize)*binSize
      let offset = offsets[bin] || 0
      offsets[bin] = hit[3] + offset
      if (offsets[bin] > yLimit) yLimit = offsets[bin]
      points.y1 = offsets[bin]
      points.y2 = offset
      points.width = width
      points.cat = hit[0]
      if (!labels[hit[0]]){
        labels[hit[0]] = bins[hit[0]]
      }
      return points
    })
    return {lines,yLimit,xLimit,labels,id}
  }
)

export const recordReducers = {
  currentRecord
}
