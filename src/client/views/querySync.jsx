import { history, queryValue, parseQueryString } from './reducers/history'
import qs from 'qs'
import convert from 'color-convert'

export const userColors = ['rgb(166,206,227)','rgb(31,120,180)','rgb(178,223,138)','rgb(51,160,44)','rgb(251,154,153)','rgb(227,26,28)','rgb(253,191,111)','rgb(255,127,0)','rgb(202,178,214)','rgb(106,61,154)']

export const colorToRGB = (color) => {
  if (color.match('rgb')){
    return color
  }
  else if (color.match('hsl')){
    color = color.replace('hsl(','').replace(')','').split(',')
    color = convert.hsl.rgb(color)
  }
  else {
    color = convert.keyword.rgb(color)
  }
  if (color){
    color = 'rgb('+color.join()+')'
  }
  return color
}


let arrays = {}

const mapDispatchToQuery = (
  {
    palette: {
      type: 'SELECT_PALETTE',
      payload: (k,v) => v,
      default: 'default',
      // params: () => ({palette:'default'})
    },
    plotShape: {
      type: 'SET_PLOT_SHAPE',
      payload: (k,v) => v,
      default: 'square'
    },
    plotResolution: {
      type: 'SET_PLOT_RESOLUTION',
      payload: (k,v) => v,
      default: 30
    },
    plotScale: {
      type: 'SET_PLOT_SCALE',
      payload: (k,v) => v,
      default: 1
    },
    zScale: {
      type: 'SET_Z_SCALE',
      payload: (k,v) => v,
      default: 'scaleSqrt'
    },
    zReducer: {
      type: 'SET_Z_REDUCER',
      payload: (k,v) => v
    },
    curveOrigin: {
      type: 'SET_CURVE_ORIGIN',
      payload: (k,v) => v,
      default: '0'
    },
    circumferenceScale: {
      type: 'SET_CIRCUMFERENCE_SCALE',
      payload: (k,v) => v,
      default: '0'
    },
    radiusScale: {
      type: 'SET_RADIUS_SCALE',
      payload: (k,v) => v,
      default: '0'
    },
    snailOrigin: {
      type: 'SET_SNAIL_ORIGIN',
      payload: (k,v) => v,
      default: 'outer'
    },
    userColors: {
      actions: (k,v) => ([
        {
          type: 'EDIT_PALETTE',
          payload: (k,v) => {
            let user = []
            v.forEach(o=>{user[o.index] = colorToRGB(o.value)})
            return {id:'user',user}
          }
        }
      ])
    },
    axes: {
      actions: (k,v) => {
        let plot = {id:'default'}
        v.forEach(o=>{
          plot[o.index] = o.value
        })
        let actions = [
          {
            type: 'EDIT_PLOT',
            payload: () => plot
          },
        ]
        Object.keys(plot).forEach(axis=>{
          if (axis != 'id'){
            actions.push({
              type: 'EDIT_FIELD',
              payload: () => ({id:plot[axis],active:true})
            })
          }
        })
        return actions
      },
      default: {x:queryValue('xField'),y:queryValue('yField'),z:queryValue('zField'),cat:queryValue('catField')}
    },
    filter: {
      actions: (k,v) => {
        let byId = {}
        let actions = []
        v.forEach(val =>{
          if (!keyed(byId,val.field)){
            byId[val.field] = {id:val.field}
          }
          if (val.index.match(/(min|max)/)){
            if (!keyed(byId[val.field],'range')){
              byId[val.field].range = []
            }
            byId[val.field].range[val.index == 'min' ? 0 : 1] = val.value
          }
          else {
            byId[val.field][val.index] = val.value
          }
        })
        Object.keys(byId).forEach(id =>{
          actions.push({
            type: 'EDIT_FILTER',
            payload: () => byId[id]
          })
          actions.push({
            type: 'EDIT_FIELD',
            payload: () => ({id,active:true})
          })
        })
        return actions
      }
    },
    field: {
      actions: (k,v) => {
        let byId = {}
        let actions = []
        Object.keys(v).forEach(k =>{
          let val = v[k]
          if (!keyed(byId,val.field)){
            byId[val.field] = {id:val.field,active:true}
          }
          if (val.index.match(/(min|max)/)){
            if (!keyed(byId[val.field],'range')){
              byId[val.field].range = []
            }
            byId[val.field].range[val.index == 'min' ? 0 : 1] = val.value
          }
          else {
            byId[val.field][val.index] = val.value
          }

        })
        Object.keys(byId).forEach(id =>{
          actions.push({
            type: 'EDIT_FIELD',
            payload: () => byId[id],
          })
        })
        return actions
      }
    },
    color0: {
      array: (k,v) => ({key:'userColors',index:0,value:v}),
      default: userColors[0]
    },
    color1: {
      array: (k,v) => ({key:'userColors',index:1,value:v}),
      default: userColors[1]
    },
    color2: {
      array: (k,v) => ({key:'userColors',index:2,value:v}),
      default: userColors[2]
    },
    color3: {
      array: (k,v) => ({key:'userColors',index:3,value:v}),
      default: userColors[3]
    },
    color4: {
      array: (k,v) => ({key:'userColors',index:4,value:v}),
      default: userColors[4]
    },
    color5: {
      array: (k,v) => ({key:'userColors',index:5,value:v}),
      default: userColors[5]
    },
    color6: {
      array: (k,v) => ({key:'userColors',index:6,value:v}),
      default: userColors[6]
    },
    color7: {
      array: (k,v) => ({key:'userColors',index:7,value:v}),
      default: userColors[7]
    },
    color8: {
      array: (k,v) => ({key:'userColors',index:8,value:v}),
      default: userColors[8]
    },
    color9: {
      array: (k,v) => ({key:'userColors',index:9,value:v}),
      default: userColors[9]
    },
    xField: {
      array: (k,v) => ({key:'axes',index:'x',value:v}),
    },
    yField: {
      array: (k,v) => ({key:'axes',index:'y',value:v}),
    },
    zField: {
      array: (k,v) => ({key:'axes',index:'z',value:v}),
    },
    catField: {
      array: (k,v) => ({key:'axes',index:'cat',value:v}),
    },
    Inv: {
      array: (k,v) => ({key:'filter',field:v.field,index:'invert',value:v.value=='true'}),
      default: false
    },
    Max: {
      array: (k,v) => ({key:'filter',index:'max',...v}),
      default: Number.POSITIVE_INFINITY
    },
    Min: {
      array: (k,v) => ({key:'filter',index:'min',...v}),
      default: Number.NEGATIVE_INFINITY
    },
    LimitMax: {
      array: (k,v) => ({key:'field',index:'max',...v}),
    },
    LimitMin: {
      array: (k,v) => ({key:'field',index:'min',...v}),
    },
    Keys: {
      array: (k,v) => ({key:'filter',field:v.field,index:'keys',value:(v.value || '').split(',').map(x=>x*1)}),
      default: ''
    },
    Order: {
      array: (k,v) => ({key:'field',field:v.field,index:'order',value:(v.value || '')}),
      default: []
    }
  }
)

export const defaultValue = param => mapDispatchToQuery[param].default || false

export const qsDefault = (param) => {
  return queryValue(param) || defaultValue(param)
}

const keyed = (o,k) => Object.prototype.hasOwnProperty.call(o,k)

export const queryToStore = (dispatch,values,searchReplace,hash) => {
  let currentSearch = history.location.search || ''
  let currentHash = hash || history.location.hash || ''
  let parsed = qs.parse(currentSearch.replace('?',''))
  if (keyed(values,'colors')){
    let oldCols = values.colors.existing.colors
    let newCols = values.colors.colors[values.colors.colors.id]
    newCols.forEach((col,i) => {
      if (newCols[i] != oldCols[i]){
        values['color'+i] = newCols[i]
      }
    })
    delete values.colors
  }
  let remove = []
  if (Object.keys(parsed).length > 0 && searchReplace){
    Object.keys(parsed).forEach(key => {
      if (!keyed(values,key)){
        let [f,k] = key.split('--')
        k = k || key
        if (keyed(mapDispatchToQuery,k)){
          let obj = mapDispatchToQuery[k]
          if (keyed(obj,'default')){
            values[key] = obj.default
            remove.push(key)
          }
          else {
            console.log(key)
          }
        }
      }
    })
    parsed = {}
  }
  Object.keys(values).forEach(key => {
    let value = values[key]
    let [field,k] = key.split('--')
    let fullKey = key
    if (k){
      key = k
      value = {value,field}
    }
    if (keyed(mapDispatchToQuery,key)){
      let obj = mapDispatchToQuery[key]
      let actions = []
      if (keyed(obj,'array')){
        let entry = obj.array(key,value)
        if (!keyed(arrays,entry.key)){
          arrays[entry.key] = []
        }
        arrays[entry.key].push(entry)
      }
      else if (keyed(obj,'actions')){
        actions = obj.actions(key,value)
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
        if (k){
          parsed[fullKey] = values[fullKey]
        }
        else {
          parsed[key] = value
        }
      }
    }
    else {
      parsed[key] = value
    }
  })
  Object.keys(arrays).forEach(key => {
    let value = arrays[key]
    if (keyed(mapDispatchToQuery,key)){
      let obj = mapDispatchToQuery[key]
      let actions = []
      if (keyed(obj,'actions')){
        actions = obj.actions(key,value)
      }
      else {
        actions.push(obj)
      }
      actions.forEach(action => {
        let type = action.type
        let payload = action.payload(key,value)
        dispatch({type,payload})
      })
      if (keyed(obj,'params')){
        console.log(key)
        console.log(value)
        let params = obj.params(key,value)
        Object.keys(params).forEach(k=>{parsed[k] = params[k]})
      }
    }
  })
  remove.forEach(key=>{delete parsed[key]})
  history.replace({hash:currentHash,search:qs.stringify(parsed)})
  return new Promise (resolve => resolve(parsed))
}

export default queryToStore;
