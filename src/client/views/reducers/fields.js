import fetch from 'isomorphic-fetch'
import store from '../store'
import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import deep from 'deep-get-set'

const requestField = createAction('REQUEST_FIELD')
const receiveField = createAction(
  'RECEIVE_FIELD',
  json => json,
  () => ({ receivedAt: Date.now() })
)
const useStoredField = createAction('USE_STORED_FIELD')

const defaultState = () => (
    {
      allIds: [],
      byId: {}
    }
)
export const fieldReducers = {

}
