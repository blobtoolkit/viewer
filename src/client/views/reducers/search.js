import { createAction, handleAction } from 'redux-actions'

export const setSearchTerm = createAction('SET_SEARCH_TERM')

export const searchTerm = handleAction(
  'SET_SEARCH_TERM',
  (state, action) => (
    action.payload
  ),
  'all'
)

export const getSearchTerm = state => state.searchTerm

export const searchReducers = {
  searchTerm
}
