import fetch from 'isomorphic-fetch'

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
    meta: json,//.children.map(child => child.data),
    receivedAt: Date.now()
  }
}

export function fetchMeta(id) {
  return function (dispatch) {
    dispatch(requestMeta(id))
    return fetch(`http://localhost:8000/api/v1/dataset/id/${id}`)
      .then(
        response => response.json(),
        error => console.log('An error occured.', error)
      )
      .then(json =>
        dispatch(receiveMeta(id, json))
      )
  }
}
