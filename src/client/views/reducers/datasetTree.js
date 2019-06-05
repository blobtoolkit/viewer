import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import { getAvailableDatasets, getAvailableDatasetIds } from './repository'
import store from '../store'

const apiUrl = API_URL || '/api/v1'

const requestDatasetTree = createAction('REQUEST_DATASET_TREE')
const receiveDatasetTree = createAction(
  'RECEIVE_DATASET_TREE',
  json => json,
  {}
)


export const datasetTree = handleActions(
  {
    REQUEST_DATASET_TREE: (state, action) => (
      {
        isFetching: true,
        isInitialised: false,
      }
    ),
    RECEIVE_DATASET_TREE: (state, action) => (
      {
        isFetching: false,
        isInitialised: true,
        tree: action.payload
      }
    )
  },
  {isInitialised: false}
)

export const getDatasetTree = state => state.datasetTree

export function fetchDatasetTree() {
  return function (dispatch) {
    dispatch(requestDatasetTree())
    return fetch(apiUrl + '/search/')
      .then(
        response => response.json(),
        error => console.log('An error occured.', error)
      )
      .then(json =>{
        dispatch(receiveDatasetTree(json))
      }
    )
  }
}


export const setExpandedNodes = createAction('SET_EXPANDED_NODES')

export const expandedNodes = handleAction(
  'SET_EXPANDED_NODES',
  (state, action) => (
    action.payload
  ),
  {}
)

export const getExpandedNodes = state => state.expandedNodes


export function expandNode(id) {
  return dispatch => {
    let state = store.getState()
    let nodes = Object.assign({},getExpandedNodes(state))
    nodes[id] = true
    dispatch(setExpandedNodes(nodes))
  }
}

export function collapseNode(id) {
  return dispatch => {
    let state = store.getState()
    let nodes = Object.assign({},getExpandedNodes(state))
    delete nodes[id]
    dispatch(setExpandedNodes(nodes))
  }
}


export const datasetTreeReducers = {
  datasetTree,
  expandedNodes
}
