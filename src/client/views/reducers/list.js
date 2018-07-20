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
import qs from 'qs'
import { history, parseQueryString, clearQuery } from './history'
import { filterToList, getFilteredList, getUnfilteredList } from './filter'
import { fetchRawData, getAllActiveFields } from './field'
import queryToStore from '../querySync'
import { selectNone, addRecords } from './select'
import { getQueryString } from './plotParameters'
import { getSelectedDatasetMeta } from './dataset'

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

const getListOfLists = state => state.lists

const arraysEqual = (a,b) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export const getLists = createSelector(
  getListOfLists,
  getFilteredList,
  getQueryString,
  getUnfilteredList,
  (lol,list,qStr,all) => {
    let ret = [
      {id:'current',list,params:list.params = qs.parse(qStr)}
    ]
    if (!arraysEqual(list,all)){
      ret.unshift({id:'all',list:all,params:{}})
    }
    ret = ret.concat(lol.allIds.map(id => lol.byId[id]))
    return ret
  }
)


export const updateSelectedList = createAction('UPDATE_SELECTED_LIST')
export const chooseList = (id,select) => {
  return function (dispatch) {
    let state = store.getState()
    let list = getListById(state,id)
    dispatch(selectNone())
    if (select){
      dispatch(addRecords(list.list))
    }
    let values = Object.assign({},list.params)
    dispatch(queryToStore({values,searchReplace:true})).then((v)=>{
      let fields = getAllActiveFields(store.getState())
      Object.keys(fields).forEach(field=>{
        dispatch(fetchRawData(field))
      })
    })
  }
}
export const selectedList = handleAction(
  'UPDATE_SELECTED_LIST',
  (state,action) => (
    action.payload
  ),
  null
)
const createSelectorForSelectedList = byIdSelectorCreator();
export const getSelectedList = state => state.selectedList


const createSelectorForListId = byIdSelectorCreator();
const _getListIdAsMemoKey = (state, id) => id;
const getList = (state, id) => state.lists ? (state.lists.byId[id] || {id}) : {id};

export const getListById = createSelectorForListId(
  _getListIdAsMemoKey,
  getList,
  getFilteredList,
  getUnfilteredList,
  getQueryString,
  (list,filtered,all,qStr) => {
    if (!list.list){
      if (list.id == 'all'){
        list.list = all
        list.params = {}
      }
      else if (list.id == 'current'){
        list.list = filtered
        list.params = qs.parse(qStr)
      }
    }
    return list
  }
);
// const getListById = (state,id) => {
//   let list = state.lists.byId[id]
//   console.log(id)
//   list = list || state.lists.byId[getSelectedList(state)]
//   if (!list){
//     if (id == 'all')
//       list = {id,list:getFilteredList(state)}
//     list.params = qs.parse(getQueryString(state))
//   }
//   return list
// }
const createSelectorForListIdentifiers = byIdSelectorCreator();
export const getIdentifiersForList = createSelectorForListIdentifiers(
  _getListIdAsMemoKey,
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
    let state = store.getState()
    list.params = qs.parse(getQueryString(state))
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
