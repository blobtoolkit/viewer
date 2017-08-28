// import fetch from 'isomorphic-fetch'
// import { createAction } from 'redux-action'
//
// export const REQUEST_REPOSITORY = 'REQUEST_REPOSITORY'
// function requestRepository() {
//   return {
//     type: REQUEST_REPOSITORY
//   }
// }
//
// export const RECEIVE_REPOSITORY = 'RECEIVE_REPOSITORY'
// function receiveRepository(json) {
//   return {
//     type: RECEIVE_REPOSITORY,
//     availableDatasets: json,
//     receivedAt: Date.now()
//   }
// }
//
// export function fetchRepository(id) {
//   return function (dispatch) {
//     dispatch(requestRepository())
//     return fetch('http://localhost:8000/api/v1/dataset/all')
//       .then(
//         response => response.json(),
//         error => console.log('An error occured.', error)
//       )
//       .then(json =>
//         dispatch(receiveRepository(json))
//       )
//   }
// }
