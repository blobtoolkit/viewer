import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import immutableUpdate from 'immutable-update';
import deep from 'deep-get-set'
import shallow from 'shallowequal'
import store from '../store'
import { byIdSelectorCreator,
  handleSimpleByDatasetAction,
  getSimpleByDatasetProperty,
  getSelectedDatasetId,
  linkIdToDataset } from './selectorCreators'
  
const apiUrl = window.apiURL || '/api/v1'

const requestIdentifiers = createAction('REQUEST_IDENTIFIERS')
const receiveIdentifiers = createAction(
  'RECEIVE_IDENTIFIERS',
  json => json,
  () => ({ receivedAt: Date.now() })
)

const useStoredIdentifiers = createAction('USE_STORED_IDENTIFIERS')

const defaultState = () => (
    {
      allIds: [],
      byId: {}
    }
)

export const identifiers = handleActions(
  {
    REQUEST_IDENTIFIERS: (state, action) => {
      return immutableUpdate(state, {
        byId: { [getSelectedDatasetId()]: {isFetching: true} }
      })
    },
    RECEIVE_IDENTIFIERS: (state, action) => {
      let id = getSelectedDatasetId()
      return immutableUpdate(state, {
        allIds: [...state.allIds, id],
        byId: { [id]: {isFetching: false, list:action.payload, lastUpdated: action.meta.receivedAt} }
      })
    }
  },
  defaultState()
)

export const getIdentifiersIsFetching = state => deep(state,'identifiers','byId','isFetching') || false

export const getIdentifiersForCurrentDataset = state => {
  let dsId = getSelectedDatasetId();
  return state.identifiers.byId[dsId] ? (state.identifiers.byId[dsId].list || []) : []
}

export function fetchIdentifiers() {
  return function (dispatch) {
    let state = store.getState();
    let existing = getIdentifiersForCurrentDataset(state)
    if (existing.length > 0){
      return existing
    }
    let id = getSelectedDatasetId()
    dispatch(requestIdentifiers(id))
    return fetch(apiUrl + '/identifiers/' + id)
      .then(
        response => response.json(),
        error => console.log('An error occured.', error)
      )
      .then(json =>
        dispatch(receiveIdentifiers(json))
      )
  }
}

export const identifierReducers = {
  identifiers
}
