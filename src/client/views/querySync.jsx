import { history, } from './reducers/history'
import qs from 'qs'

let arrays = {}

const mapDispatchToQuery = (
  {
    palette: {
      actions: [
        {
          type: 'SELECT_PALETTE',
          payload: (k,v) => v
        }
      ]
    },
    plotShape: {
      type: 'SET_PLOT_SHAPE',
      payload: (k,v) => v
    },
    plotResolution: {
      type: 'SET_PLOT_RESOLUTION',
      payload: (k,v) => v
    },
    plotScale: {
      type: 'SET_PLOT_SCALE',
      payload: (k,v) => v
    },
    zScale: {
      type: 'SET_Z_SCALE',
      payload: (k,v) => v
    },
    zReducer: {
      type: 'SET_Z_REDUCER',
      payload: (k,v) => v
    },
    colors: {
      type: 'EDIT_PALETTE',
      payload: (k,v) => v.colors,
      params: (k,v) => {
        let oldCols = v.existing.colors
        let newCols = v.colors[v.colors.id]
        let toAdd = {}
        let toRemove = []
        newCols.forEach((col,i) => {
          if (newCols[i] != oldCols[i]){
            toAdd['color'+i] = newCols[i]
          }
        })
        return toAdd
      }
    },
    userColors: {
      type: 'EDIT_PALETTE',
      payload: (k,v) => ({id:'user',user:v}),
    },
    color0: {
      array: (k,v) => ({key:'userColors',index:0,value:v}),
    },
    color1: {
      array: (k,v) => ({key:'userColors',index:1,value:v}),
    },
    color2: {
      array: (k,v) => ({key:'userColors',index:2,value:v}),
    },
    color3: {
      array: (k,v) => ({key:'userColors',index:3,value:v}),
    },
    color4: {
      array: (k,v) => ({key:'userColors',index:4,value:v}),
    },
    color5: {
      array: (k,v) => ({key:'userColors',index:5,value:v}),
    },
    color6: {
      array: (k,v) => ({key:'userColors',index:6,value:v}),
    },
    color7: {
      array: (k,v) => ({key:'userColors',index:7,value:v}),
    },
    color8: {
      array: (k,v) => ({key:'userColors',index:8,value:v}),
    },
    color9: {
      array: (k,v) => ({key:'userColors',index:9,value:v}),
    }
  }
)

const keyed = (o,k) => Object.prototype.hasOwnProperty.call(o,k)

export const queryToStore = (dispatch,values,search,hash) => {
  let currentSearch = search || history.location.search || ''
  let currentHash = hash || history.location.hash || ''
  let parsed = qs.parse(currentSearch.replace('?',''))
  Object.keys(values).forEach(key => {
    let value = values[key]
    if (keyed(mapDispatchToQuery,key)){
      let obj = mapDispatchToQuery[key]
      let actions = []
      if (keyed(obj,'array')){
        let entry = obj.array(key,value)
        if (!keyed(arrays,entry.key)){
          arrays[entry.key] = []
        }
        arrays[entry.key][entry.index] = entry.value
      }
      else if (keyed(obj,'actions')){
        actions = obj.actions
      }
      else {
        actions = [{...obj}]
      }
      actions.forEach(action=>{
        let type = action.type
        let payload = action.payload(key,value)
        dispatch({type,payload})
      })
      if (keyed(obj,'params')){
        let params = obj.params(key,value)
        Object.keys(params).forEach(k=>{parsed[k] = params[k]})
      }
      else {
        parsed[key] = value
      }
    }
    else {
      parsed[key] = value
    }
  })
  Object.keys(arrays).forEach(key => {
    let value = arrays[key]
    if (keyed(mapDispatchToQuery,key)){
      let action = mapDispatchToQuery[key]
      let type = action.type
      let payload = action.payload(key,value)
      dispatch({type,payload})
    }
  })
  history.replace({hash:currentHash,search:qs.stringify(parsed)})
}

export default queryToStore;
