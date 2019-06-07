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
    return fetch(apiUrl + '/search/tree/available')
      .then(
        response => response.json(),
        error => console.log('An error occured.', error)
      )
      .then(json =>{
        dispatch(receiveDatasetTree(json))
        dispatch(fetchTargetTree())
      }
    )
  }
}

const requestTargetTree = createAction('REQUEST_TARGET_TREE')
const receiveTargetTree = createAction(
  'RECEIVE_TARGET_TREE',
  json => json,
  {}
)

export const targetTree = handleActions(
  {
    REQUEST_TARGET_TREE: (state, action) => (
      {
        isFetching: true,
        isInitialised: false,
      }
    ),
    RECEIVE_TARGET_TREE: (state, action) => (
      {
        isFetching: false,
        isInitialised: true,
        tree: action.payload
      }
    )
  },
  {isInitialised: false}
)

export const getTargetTree = state => state.targetTree

export function fetchTargetTree() {
  return function (dispatch) {
    dispatch(requestTargetTree())
    return fetch(apiUrl + '/search/tree/target')
      .then(
        response => response.json(),
        error => console.log('An error occured.', error)
      )
      .then(json =>{
        dispatch(receiveTargetTree(json))
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
  getTargetTree,
  getExpandedNodes,
  (data, target, nodes) => {
    if (!data.tree || !target.tree){
      return false
    }
    let ranks = []
    let widths = []
    let depth = 0;
    const prepareNested = (obj, avail, name, depth) => {
      if (obj.d){
        let nested = Object.keys(obj.d).map((key,i) => {
          let descendants
          let count = 0
          let species = 0
          let leaf
          if (avail.d && avail.d[key]){
            if (nodes.hasOwnProperty(obj.d[key].n)){
              descendants = prepareNested(obj.d[key],avail.d[key],key,depth+1)
            }
            count = avail.d[key].a
            species = avail.d[key].s
            leaf = true
          }
          else if (nodes.hasOwnProperty(obj.d[key].n)){
            descendants = prepareNested(obj.d[key],{},key,depth+1)
          }
          let total = obj.d[key].ta
          let speciesTotal = obj.d[key].ts
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
            total,
            leaf,
            species,
            speciesTotal,
            parent: obj.n
          }
        })
        return nested
      }
    }
    let nested = prepareNested(target.tree, data.tree,'root',depth)
    let targetNested
    return {nested, ranks, widths}
  }
)


export const datasetTreeReducers = {
  datasetTree,
  targetTree,
  expandedNodes
}
