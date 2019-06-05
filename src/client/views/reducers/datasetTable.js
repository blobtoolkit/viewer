import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import { getAvailableDatasets, getAvailableDatasetIds } from './repository'
import store from '../store'

export const setDatasetPage = createAction('SET_DATASET_PAGE')

export const datasetPage = handleAction(
  'SET_DATASET_PAGE',
  (state, action) => (
    action.payload
  ),
  0
)

export const getDatasetPage = state => state.datasetPage


export const setDatasetPageSize = createAction('SET_DATASET_PAGESIZE')

export const datasetPageSize = handleAction(
  'SET_DATASET_PAGESIZE',
  (state, action) => (
    action.payload
  ),
  10
)

export const getDatasetPageSize = state => state.datasetPageSize


export const setDatasetSorted = createAction('SET_DATASET_SORTED')

export const datasetSorted = handleAction(
  'SET_DATASET_SORTED',
  (state, action) => (
    action.payload
  ),
  []
)

export const getDatasetSorted = state => state.datasetSorted


export const summaryBuscoSet = () => ''

export const columnAccessors = createSelector(
  summaryBuscoSet,
  (buscoSet) => {
    let busco = {}
    if (buscoSet){
      busco.lineage = d => {
        if (!d.summaryStats || !d.summaryStats.busco || !d.summaryStats.busco[`${buscoSet}_odb9`]){
          return ''
        }
        return buscoSet
      }
      busco.string = d => {
        if (!d.summaryStats || !d.summaryStats.busco || !d.summaryStats.busco[`${buscoSet}_odb9`]){
          return ''
        }
        return d.summaryStats.busco[`${buscoSet}_odb9`].string
      }
    }
    else {
      busco.lineage = d => {
        if (!d.summaryStats || !d.summaryStats.busco || Object.keys(d.summaryStats.busco).length == 0){
          return ''
        }
        return Object.keys(d.summaryStats.busco)[0].replace('_odb9','')
      }
      busco.string = d => {
        if (!d.summaryStats || !d.summaryStats.busco || Object.keys(d.summaryStats.busco).length == 0){
          return ''
        }
        return d.summaryStats.busco[Object.keys(d.summaryStats.busco)[0]].string
      }
    }
    let accessors = {
      id: d => d.id,
      taxon: d => d.taxon_name,
      accession: d => d.accession,
      records: d => {
        if (d.summaryStats && d.summaryStats.hits && d.summaryStats.hits.total){
          return d.summaryStats.hits.total.count
        }
        else {
          return ''
        }
      },
      span: d => {
        if (d.summaryStats && d.summaryStats.hits && d.summaryStats.hits.total){
          return d.summaryStats.hits.total.span
        }
        else {
          return ''
        }
      },
      n50: d => {
        if (d.summaryStats && d.summaryStats.hits && d.summaryStats.hits.total){
          return d.summaryStats.hits.total.n50
        }
        else {
          return ''
        }
      }
    }
    if (busco){
      Object.keys(busco).forEach(key=>{
        accessors[`busco-${key}`] = busco[key]
      })
    }
    accessors.phylum = d => d.phylum ? d.phylum : '-'
    accessors['read-sets'] = d => {
      if (d.summaryStats && d.summaryStats.readMapping){
        return Object.keys(d.summaryStats.readMapping).length
      }
      else {
        return ''
      }
    }
    return accessors
  }
)

export const datasetSummaries = createSelector(
  getAvailableDatasetIds,
  getAvailableDatasets,
  columnAccessors,
  (ids,datasets,accessors) => {
    let data = []
    ids.forEach(id=>{
      let values = {}
      Object.keys(accessors).forEach(key=>{
        values[key] = accessors[key](datasets[id])
      })
      data.push(values)
    })
    return data
  }
)

const ascComma = (a,b) => {
  if (a.length === b.length) {
    return a > b ? 1 : -1;
  }
  return a.length > b.length ? 1 : -1;
}

export const listingColumns = createSelector(
  columnAccessors,
  (accessors) => {
    let columns = []
    let numeric = ['records','span','n50','read-sets']
    let wide = ['taxon','busco-string']
    Object.keys(accessors).forEach(key=>{
      let config = {}
      config.id = key,
      config.Header = key.charAt(0).toUpperCase() + key.slice(1),
      config.accessor = d => {
        if (numeric.includes(key)){
          return d[key].toLocaleString()
        }
        return d[key]
      }
      if (wide.includes(key)){
        config.width = 300
      }
      if (numeric.includes(key)){
        config.style = {textAlign:'right'}
        config.sortMethod = ascComma
      }
      columns.push(config)
    })
    return columns
  }
)



export const datasetTableReducers = {
  datasetPage,
  datasetPageSize,
  datasetSorted
}
