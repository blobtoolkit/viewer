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
  {1: 0}
)

export const getExpandedNodes = state => state.expandedNodes


export function expandNode(id,parent) {
  return dispatch => {
    let state = store.getState()
    let nodes = Object.assign({},getExpandedNodes(state))
    nodes[id*1] = parent
    dispatch(setExpandedNodes(nodes))
  }
}

const collapseChildren = (nodes,id) => {
  delete nodes[id*1]
  let sibs = Object.keys(nodes).filter(key => nodes[key] == id)
  sibs.forEach(sib=>{
    collapseChildren(nodes,sib)
  })
}

export function collapseNode(id) {
  return dispatch => {
    let state = store.getState()
    let nodes = Object.assign({},getExpandedNodes(state))
    collapseChildren(nodes,id)
    dispatch(setExpandedNodes(nodes))
  }
}

export const treeData = createSelector(
  getDatasetTree,
  getExpandedNodes,
  (data, nodes) => {
    if (!data.tree){
      return false
    }
    let ranks = []
    let widths = []
    let depth = 0;
    const prepareNested = (obj, name, depth) => {
      if (obj.d){
        let nested = Object.keys(obj.d).map((key,i) => {
          let descendants
          if (nodes.hasOwnProperty(obj.d[key].n)){
            descendants = prepareNested(obj.d[key],key,depth+1)
          }
          let count = obj.d[key].c
          let node_id = obj.d[key].n
          let rank = obj.d[key].r || ''
          ranks[depth] = rank
          let width = key.length + String((count || 0)).length + 3
          widths[depth] = Math.max(rank.length,width,(widths[depth] || 0))
          return {
            name: key,
            depth,
            descendants,
            node_id,
            count,
            parent: obj.n
          }
        })
        return nested
      }
    }
    let nested = prepareNested(data.tree,'root',depth)


    return {nested, ranks, widths}
  }
)


export const datasetTreeReducers = {
  datasetTree,
  expandedNodes
}
