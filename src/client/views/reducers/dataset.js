import { combineReducers } from 'redux'

import {
  SELECT_DATASET,
  INVALIDATE_DATASET,
  REQUEST_META,
  RECEIVE_META
} from '../actions/dataset'

export function selectedDataset(state = 'ds3', action) {
  switch (action.type) {
    case SELECT_DATASET:
      return action.id
    default:
      return state
  }
}

export function metadata(
  state = {
    isFetching: false,
    didInvalidate: false,
    meta: {}
  },
  action
) {
  switch (action.type) {
    case INVALIDATE_DATASET:
      return Object.assign({}, state, {
        didInvalidate: true
      })
    case REQUEST_META:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_META:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        meta: action.meta,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

export function metadataByDataset(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_DATASET:
    case RECEIVE_META:
    case REQUEST_META:
      return Object.assign({}, state, {
        [action.id]: metadata(state[action.id], action)
      })
    default:
      return state
  }
}
