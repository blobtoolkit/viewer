import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import { byIdSelectorCreator,
  handleSimpleByDatasetAction,
  getSimpleByDatasetProperty,
  getSelectedDatasetId,
  linkIdToDataset } from './selectorCreators'
import immutableUpdate from 'immutable-update';
import deep from 'deep-get-set'
import shallow from 'shallowequal'
import store from '../store'


export const addList = createAction('ADD_LIST')
export const editList = createAction('EDIT_LIST')

export const lists = handleActions(
  {
    ADD_LIST: (state, action) => (
      immutableUpdate(state, {
        byId: { [linkIdToDataset(action.payload.id)]: action.payload },
        allIds: [...state.allIds, linkIdToDataset(action.payload.id)]
      })
    ),
    EDIT_LIST: (state, action) => {
      let id = linkIdToDataset(action.payload.id)
      let fields = Object.keys(action.payload).filter((key)=>{return key != 'id'})
      return immutableUpdate(state, {
        byId: {
          [id]: Object.assign(...fields.map(f => ({[f]: action.payload[f]})))
        }
      })
    }
  },
  {
    byId: {},
    allIds: []
  }
)


export function createList(val) {
  return function(dispatch){
    val.id = val.id.replace(/\s/g,'_')
    let list = val
    dispatch(addList(list))
  }
}

export const listReducers = {
  lists
}
