import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector, createSelectorCreator } from 'reselect'
import deep from 'deep-get-set'
import shallow from 'shallowequal'
import store from '../store'
import { getDetailsForFieldId } from './field'
import { filterList } from './repository'


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
      let newState = Object.assign({}, state);
      newState.byId[action.payload.id] = action.payload;
      return newState;
    }
  },
  {
    byId: {},
    allIds: []
  }
)

const createSelectorForFilterId = createSelectorCreator((resultFunc) => {
  const memoAll = {};
  return (filterId, ...args) => {
    if (!memoAll[filterId]) {
      memoAll[filterId] = {};
    }
    const memo = memoAll[filterId];
    if (!shallow(memo.lastArgs, args)) {
      memo.lastArgs = args;
      memo.lastResult = resultFunc(...args);
    }
    return memo.lastResult;
  };
});

const _getFilterIdAsMemoKey = (state, filterId) => filterId;
const getMetaDataForFilter = (state, filterId) => state.filters.byId[filterId];

export const getDetailsForFilterId = createSelectorForFilterId(
  _getFilterIdAsMemoKey,
  getMetaDataForFilter,
  (state,filterId) => getDetailsForFieldId(state,filterId),
  (filterMeta = {}, fieldMeta = {}) => {
    let obj = {
      filterId: filterMeta.id,
      filterType: 'range',
      filterRange: filterMeta.range ? filterMeta.range.slice(0) : fieldMeta.range ? fieldMeta.range.slice(0) : [1,10],
      filterLimit: fieldMeta.range ? fieldMeta.range.slice(0) : [1,10],
      xScale: fieldMeta.xScale
    }
    return obj
  }
);

export const filterReducers = {
  filters
}
