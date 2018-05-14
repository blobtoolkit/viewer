import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import { byIdSelectorCreator,
  handleSimpleByDatasetAction,
  getSimpleByDatasetProperty,
  getSelectedDatasetId,
  linkIdToDataset } from './selectorCreators'
import { getIdentifiers, fetchIdentifiers } from './identifiers'
import immutableUpdate from 'immutable-update';
import deep from 'deep-get-set'
import shallow from 'shallowequal'
import store from '../store'
import { parseQueryString } from './history'


export const addList = createAction('ADD_LIST')
export const editList = createAction('EDIT_LIST')

export const lists = handleActions(
  {
    ADD_LIST: (state, action) => (
      immutableUpdate(state, {
        byId: { [action.payload.id]: action.payload },
        allIds: [...state.allIds, action.payload.id]
      })
    ),
    EDIT_LIST: (state, action) => {
      let id = action.payload.id
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

const getListOfLists = () => {
  let state = store.getState()
  let ids = state.lists.allIds || []
  return ids
}

export const getLists = (state) => {
  let ids = state.lists.allIds || []
  let lists = ids.map(i => state.lists.allIds[i])
  return lists
}


export const updateSelectedList = createAction('UPDATE_SELECTED_LIST')
export const selectedList = handleAction(
  'UPDATE_SELECTED_LIST',
  (state,action) => (
    action.payload
  ),
  null
)
const createSelectorForSelectedList = byIdSelectorCreator();
export const getSelectedList = state => state.selectedList

const getListById = (state,id) => state.lists.byId[getSelectedList(state)] || {}
const createSelectorForListIdentifiers = byIdSelectorCreator();
export const getIdentifiersForList = createSelectorForListIdentifiers(
  getSelectedList,
  getListById,
  getIdentifiers,
  (list,ids) => {
    let ret = [];
    (list.list || []).forEach(index => {ret.push(ids[index])})
    return ret;
  }
)

export function createList(val) {
  return function(dispatch){
    val.id = val.id.replace(/\s/g,'_')
    let list = val
    list.params = parseQueryString()
    dispatch(addList(list))
  }
}

export function uploadedFileToList(acceptedFiles) {
  return function(dispatch){
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
          const fileAsBinaryString = reader.result;
          let obj = JSON.parse(fileAsBinaryString)
          dispatch(fetchIdentifiers()).then(ids=>{
            obj.list = []
            obj.id = 'user_'+obj.id
            if (ids.payload) ids = ids.payload
            for (let i = 0,id; id = ids[i]; i++){
              if (obj.identifiers.indexOf(id) != -1)
              obj.list.push(i)
            }
            delete obj.identifiers
            dispatch(addList(obj))
          })
      };
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.readAsBinaryString(file);
      window.URL.revokeObjectURL(file.preview);
    });
  }
}

export const listReducers = {
  lists,
  selectedList
}
