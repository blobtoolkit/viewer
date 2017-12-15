import fetch from 'isomorphic-fetch'
import store from '../store'

export const SELECT_DATASET = 'SELECT_DATASET'
export function selectDataset(id) {
  return {
    type: SELECT_DATASET,
    id
  }
}

export const INVALIDATE_DATASET = 'INVALIDATE_DATASET'
export function invalidateDataset(id) {
  return {
    type: INVALIDATE_DATASET,
    id
  }
}

export const REQUEST_META = 'REQUEST_META'
function requestMeta(id) {
  return {
    type: REQUEST_META,
    id
  }
}

export const RECEIVE_META = 'RECEIVE_META'
function receiveMeta(id, json) {
  return {
    type: RECEIVE_META,
    id,
    meta: json,
    receivedAt: Date.now()
  }
}

export const USE_STORED_META = 'USE_STORED_META'
function useStoredMeta(id) {
  return {
    type: USE_STORED_META
  }
}

export function fetchMeta(id) {
  return function (dispatch) {
    dispatch(selectDataset(id))
    dispatch(requestMeta(id))
    let meta = store.getState().metadataByDataset[id].meta;
    if (meta.hasOwnProperty('id')){
      dispatch(useStoredMeta(id, meta))
      return
    }
    return fetch(`http://192.168.1.67:8000/api/v1/dataset/id/${id}`)
      .then(
        response => response.json(),
        error => console.log('An error occured.', error)
      )
      .then(json =>
        dispatch(receiveMeta(id, json))
      )
  }
}
