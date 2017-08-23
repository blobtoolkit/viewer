import { combineReducers } from 'redux'

import {
  REQUEST_REPOSITORY,
  RECEIVE_REPOSITORY
} from '../actions/repository'

export function repository(
  state = {
    isFetching: false,
    availableDatasets: []
  },
  action
) {
  switch (action.type) {
    case REQUEST_REPOSITORY:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_REPOSITORY:
      return Object.assign({}, state, {
        isFetching: false,
        availableDatasets: action.availableDatasets,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}
