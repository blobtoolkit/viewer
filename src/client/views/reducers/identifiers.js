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
import { getSelectedDataset } from './dataset'

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
      list: []
    }
)

export const identifiers = handleActions(
  {
    REQUEST_IDENTIFIERS: (state, action) => {
      return immutableUpdate(state, {isFetching: true})
    },
    RECEIVE_IDENTIFIERS: (state, action) => {
      return immutableUpdate(state, {isFetching: false, list:action.payload, lastUpdated: action.meta.receivedAt}
      )
    }
  },
  defaultState()
)

export const getIdentifiersIsFetching = state => deep(state,'identifiers','byId','isFetching') || false

export const getIdentifiers = state => state.identifiers ? state.identifiers.list : []


export function fetchIdentifiers() {
  return function (dispatch) {
    let state = store.getState();
    let existing = getIdentifiers(state)
    if (existing.length > 0){
      return new Promise (resolve => resolve(existing))
    }
    let id = getSelectedDataset(state)
    dispatch(requestIdentifiers(id))
    return fetch(apiUrl + '/identifiers/' + id)
      .then(
        response => response.json(),
        error => console.log('An error occured.', error)
      )
      .then(json => {
        return dispatch(receiveIdentifiers(json))
      }

      )
  }
}

export const identifierReducers = {
  identifiers
}
