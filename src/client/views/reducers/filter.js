import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import deep from 'deep-get-set'
import store from '../store'


export const addFilter = createAction('ADD_FILTER')
export const editFilter = createAction('EDIT_FILTER')

export const filters = handleActions(
  {
    ADD_FILTER: (state, action) => {
      state.byId[action.payload.id] = action.payload;
      state.allIds.push(action.payload.id);
      return state;
    },
    EDIT_FILTER: (state, action) => {
      console.log(action);
      state.byId[action.payload.id] = action.payload;
      return state;
    }
  },
  {
    byId: {},
    allIds: []
  }
)


const getFilterMetadata = (state, props) => {
  let id = props.filterId
  const filterMetadataById = deep(state,['filters','byId',id]) || {}
  return filterMetadataById
}
//const getFilterMetadata = (state, id) => deep(state,['fields','byId',id]) || {}
// export const makeGetFilterMetadata = () => createSelector(
//   getFilterMetadata,
//   (meta) => ({ meta })
// )
export const makeGetFilterMetadata = () => createSelector(
  [ getFilterMetadata ],
  (meta) => meta
)


export const filterReducers = {
  filters
}
