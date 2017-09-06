import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector, createSelectorCreator } from 'reselect'
import immutableUpdate from 'immutable-update';
import deep from 'deep-get-set'
import shallow from 'shallowequal'
import store from '../store'

export const setDimension = createAction('SET_DIMENSION')

export const dimensions = handleAction(
  'SET_DIMENSION',
  (state, action) => {
    let id = action.payload.id
    let fields = Object.keys(action.payload).filter((key)=>{return key != 'id'})
    return immutableUpdate(state, {
      byId: {
        [id]: Object.assign(...fields.map(f => ({[f]: action.payload[f]})))
      }
    })
  },
  {
    byId: {
      preview:{
        width:100,
        height:100,
        xDomain:[0,100],
        yDomain:[0,100],
        xScale:'scaleLinear',
        yScale:'scaleLinear'
      }
    }
  }
)

const createSelectorForDimensionId = createSelectorCreator((resultFunc) => {
  const memoAll = {};
  return (dimensionId, ...args) => {
    if (!memoAll[dimensionId]) {
      memoAll[dimensionId] = {};
    }
    const memo = memoAll[dimensionId];
    if (!shallow(memo.lastArgs, args)) {
      memo.lastArgs = args;
      memo.lastResult = resultFunc(...args);
    }
    return memo.lastResult;
  };
});

const _getDimensionIdAsMemoKey = (state, dimensionId) => dimensionId;
const getDimensions = (state, dimensionId) => state.dimensions.byId[dimensionId];

export const getDimensionsbyDimensionId = createSelectorForDimensionId(
  _getDimensionIdAsMemoKey,
  getDimensions,
  (dimensions) => dimensions
);

export const dimensionReducers = {
  dimensions
}
