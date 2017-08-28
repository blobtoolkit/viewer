// import fetch from 'isomorphic-fetch'
// import store from '../store'
// import { createAction, handleAction, handleActions } from 'redux-actions'
// import { createSelector } from 'reselect'
// import deep from 'deep-get-set'
//
// const selectDataset = createAction('SELECT_DATASET')
// const invalidateDataset = createAction('INVALIDATE_DATASET')
// const requestMeta = createAction('REQUEST_META')
// const receiveMeta = createAction(
//   'RECEIVE_META',
//   json => json,
//   () => ({ receivedAt: Date.now() })
// )
// const useStoredMeta = createAction('USE_STORED_META')
//
// export function fetchMeta(id) {
//   return function (dispatch) {
//     dispatch(selectDataset(id))
//     dispatch(requestMeta(id))
//     let json = deep(store.getState(),['metadata','byId',id,'meta']);
//     if (json){
//       dispatch(useStoredMeta(json))
//       return
//     }
//     return fetch(`http://localhost:8000/api/v1/dataset/id/${id}`)
//       .then(
//         response => response.json(),
//         error => console.log('An error occured.', error)
//       )
//       .then(json =>
//         dispatch(receiveMeta(json))
//       )
//   }
// }
//
// export const selectedDataset = handleAction(
//   'SELECT_DATASET',
//   (state, action) => (
//     action.payload
//   ),
//   'ds1'
// )
//
//
// //TODO finish migrating to redux-actions
//
// // import {
// //   SELECT_DATASET,
// //   INVALIDATE_DATASET,
// //   REQUEST_META,
// //   RECEIVE_META
// // } from '../actions/dataset'
// //
// // export function selectedDataset(state = 'ds3', action) {
// //   switch (action.type) {
// //     case SELECT_DATASET:
// //       return action.id
// //     default:
// //       return state
// //   }
// // }
//
// const defaultState = () => (
//     {
//       isFetching: false,
//       didInvalidate: false,
//       lastUpdated: false,
//       allIds: [],
//       byId: {}
//     }
// )
//
// // export const metadata = handleActions(
// //   {
// //     INVALIDATE_DATASET: (state, action) => ({
// //       didInvalidate: true
// //     }),
// //     REQUEST_META: (state, action) => ({
// //       isFetching: true,
// //       didInvalidate: false
// //     }),
// //     RECEIVE_META: (state, action) => ({
// //       isFetching: false,
// //       byId: { ds1: action.payload},//.reduce((obj, item) => (obj[item.id] = item, obj) ,{}),
// //       //allIds: ['ds1'],//.map(item => item.id),
// //       lastUpdated: action.meta.receivedAt
// //     })
// //   },
// //   defaultState()
// // )
//
// // function metadata(
// //   state = {
// //     isFetching: false,
// //     didInvalidate: false,
// //     meta: {}
// //   },
// //   action
// // ) {
// //   switch (action.type) {
// //     case INVALIDATE_DATASET:
// //       return Object.assign({}, state, {
// //         didInvalidate: true
// //       })
// //     case REQUEST_META:
// //       return Object.assign({}, state, {
// //         isFetching: true,
// //         didInvalidate: false
// //       })
// //     case RECEIVE_META:
// //       return Object.assign({}, state, {
// //         isFetching: false,
// //         didInvalidate: false,
// //         meta: action.meta,
// //         lastUpdated: action.receivedAt
// //       })
// //     default:
// //       return state
// //   }
// // }
//
// // export function metadataByDataset(state = {}, action) {
// //   switch (action.type) {
// //     case INVALIDATE_DATASET:
// //       return Object.assign({}, state, {
// //         [action.id]: metadata(state[action.id], action)
// //       })
// //     case RECEIVE_META:
// //       return Object.assign({}, state, {
// //         [action.id]: metadata(state[action.id], action)
// //       })
// //     case REQUEST_META:
// //       return Object.assign({}, state, {
// //         [action.id]: metadata(state[action.id], action)
// //       })
// //     default:
// //       return state
// //   }
// // }
//
export const datasetReducers = {

}
