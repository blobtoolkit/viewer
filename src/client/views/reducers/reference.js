import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import { byIdSelectorCreator } from './selectorCreators'
import immutableUpdate from 'immutable-update';
import deep from 'deep-get-set'
import store from '../store'
import { history } from './history'
import { getSelectedDatasetMeta } from './dataset'
import { addFilter, editFilter, getMetaDataForFilter } from './filter'
import { getCatAxis } from './plot'
import { getDimensionsbyDimensionId, setDimension, getPreviewDimensions } from './dimension'
import * as d3 from 'd3'
import qs from 'qs'
import { getParsedQueryString, getQueryValue, getDatasetID, getView, getStatic, setQueryString, getHashString } from './location'

const apiUrl = API_URL || '/api/v1'

const requestReferenceValues = createAction('REQUEST_REFERENCE_VALUES')
const receiveReferenceValues = createAction('RECEIVE_REFERENCE_VALUES')
const useStoredReferenceValues = createAction('USE_STORED_REFERENCE_VALUES')
const clearReferenceValues = createAction('CLEAR_REFERENCE_VALUES')

export const referenceValues = handleActions(
  {
    REQUEST_REFERENCE_VALUES: (state, action) => (
      state
    ),
    RECEIVE_REFERENCE_VALUES: (state, action) => (
      immutableUpdate(state, {
        byId: { [action.payload.id]: action.payload.values },
        allIds: [...state.allIds, action.payload.id]
      })
    ),
    USE_STORED_REFERENCE_VALUES: (state, action) => (
      state
    ),
    CLEAR_REFERENCE_VALUES: (state, action) => (
      {
        byId: {},
        allIds: []
      }
    )
  },
  {
    byId: {},
    allIds: []
  }
)

export const getReferenceValues = state => state.referenceValues

export function resetReferenceValues(fieldId) {
  return dispatch => {
    let state = store.getState()
    let params = getParsedQueryString(state)
    let hash = getHashString(state)
    let parsed = {}
    Object.keys(params).forEach(param=>{
      let parts = param.split('--')
      if (parts.length == 3){
        if (fieldId && parts[1] != fieldId){
          parsed[param] = params[param]
        }
      }
    })
    let search = qs.stringify(parsed)
    history.push({search,hash})
    dispatch(setQueryString(search))
    dispatch(clearReferenceValues())
  }
}

const updateQueryString = (params, hash, dispatch) => {
  let search = qs.stringify(params)
  history.push({search,hash})
  dispatch(setQueryString(search))
}


export function fetchReferenceValues(fieldId, datasetId, last) {
  return dispatch => {
    let state = store.getState()
    let params = getParsedQueryString(state)
    let hash = getHashString(state)
    let referenceValues = getReferenceValues(state)
    let id = `${datasetId}--${fieldId}`
    let param = `${id}--Active`
    dispatch(requestReferenceValues(id))
    let values = deep(state,['referenceValues','byId',id]);
    if (values){
      dispatch(useStoredReferenceValues(values))
      if (last){
        Object.keys(last).forEach(key=>{
          params[key] = true
        })
        updateQueryString(params, hash, dispatch)
      }
      return Promise.resolve(useStoredReferenceValues(values));
    }
    return fetch(`${apiUrl}/field/${datasetId}/${fieldId}`)
      .then(
        response => response.json(),
        // error => console.log('An error occured.', error)
      )
      .then(json => {
        let values
        if (!json.keys || json.keys.length == 0){
          values = json.values
        }
        else {
          values = json.values.map(v=>json.keys[v])
        }
        dispatch(receiveReferenceValues({id,values}))
        if (last){
          Object.keys(last).forEach(key=>{
            params[key] = true
          })
          updateQueryString(params, hash, dispatch)
        }
      })
   }
}


export const referenceReducers = {
  referenceValues
}
