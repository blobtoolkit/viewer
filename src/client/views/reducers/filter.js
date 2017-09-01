import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import deep from 'deep-get-set'
import store from '../store'
import { getFieldMetadata } from './field'


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


const getFilterMetadata = (state, id) => {
  const filterMeta = state.filters.byId[id] || {}//deep(state,['filters','byId',id]) || {}
  return {
    filterId: id,
    filterType: 'range',
    filterRange: filterMeta.range || [1,10]
  }
}

export const makeGetFilterMetadata = () => createSelector(
  [ getFilterMetadata, getFieldMetadata ],
  (filterMeta,fieldMeta) => {
    filterMeta.filterLimit = fieldMeta.range || [1,10]
    filterMeta.xScale = fieldMeta.xScale
    console.log(fieldMeta.xScale)
    return filterMeta
  }
)


export const filterReducers = {
  filters
}
