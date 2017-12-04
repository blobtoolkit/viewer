import { createSelectorCreator } from 'reselect'
import { handleAction } from 'redux-actions'
import shallow from 'shallowequal'
import immutableUpdate from 'immutable-update';
import store from '../store'

export const getSelectedDatasetId = () => store.getState().selectedDataset || false;

export const linkIdToDataset = (id) => {
  let ds = getSelectedDatasetId()
  let re = new RegExp('^'+ds)
  if (!(id || 'new').match(re)) id = ds+'_'+id
  return id
}

export const byIdSelectorCreator = () => {
  return createSelectorCreator((resultFunc) => {
    const memoAll = {};
    return (id, ...args) => {
      if (!memoAll[id]) {
        memoAll[id] = {};
      }
      const memo = memoAll[id];
      if (!shallow(memo.lastArgs, args)) {
        memo.lastArgs = args;
        memo.lastResult = resultFunc(...args);
      }
      return memo.lastResult;
    };
  })
}

export const handleSimpleByDatasetAction = (string) => handleAction(
  string,
  (state, action) => {
    return immutableUpdate(state, {
      byDataset: { [getSelectedDatasetId()]: action.payload }
    })
  },
  {byDataset:{}}
)

export const getSimpleByDatasetProperty = (property) =>
  (state, datasetId) => state[property] ? state[property].byDataset[getSelectedDatasetId()] : undefined
