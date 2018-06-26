import { createAction, handleAction } from 'redux-actions'
import { history, urlSearchTerm } from './history'
import { createSelector } from 'reselect'

export const setSearchTerm = createAction('SET_SEARCH_TERM')

export const searchTerm = handleAction(
  'SET_SEARCH_TERM',
  (state, action) => (
    action.payload
  ),
  ''
)

export const getSearchTerm = state => state.searchTerm

export const searchReducers = {
  searchTerm
}
