import { history } from './reducers/history'
import { getQueryValue } from './reducers/location'
import qs from 'qs'
import convert from 'color-convert'
import { batchActions } from 'redux-batched-actions';

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

const keyed = (o,k) => Object.prototype.hasOwnProperty.call(o,k)

const mapDispatchToQuery = (
  {
    staticThreshold: {
      type: 'SET_STATIC_THRESHOLD',
      payload: (k,v) => v,
      default: STATIC_THRESHOLD
    },
    nohitThreshold: {
      type: 'SET_NOHIT_THRESHOLD',
      payload: (k,v) => v,
      default: NOHIT_THRESHOLD
    },
    circleLimit: {
      type: 'SET_CIRCLE_LIMIT',
      payload: (k,v) => v,
      default: CIRCLE_LIMIT
    },
    otherLimit: {
      type: 'SET_OTHER_LIMIT',
      payload: (k,v) => v,
      default: 9
    },
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
    plotGraphics: {
      type: 'SET_PLOT_GRAPHICS',
      payload: (k,v) => v,
      default: 'auto'
    },
    svgThreshold: {
      type: 'SET_SVG_THRESHOLD',
      payload: (k,v) => v,
      default: 10000
    },
    pngResolution: {
      type: 'SET_PNG_RESOLUTION',
      payload: (k,v) => v,
      default: 2000
    },
    zScale: {
      type: 'SET_Z_SCALE',
      payload: (k,v) => v,
      default: 'scaleSqrt'
    },
    zReducer: {
      type: 'SET_Z_REDUCER',
      payload: (k,v) => v,
      default: 'sum'
    },
    curveOrigin: {
      type: 'SET_CURVE_ORIGIN',
      payload: (k,v) => v,
      default: '0'
    },
    scaleTo: {
      type: 'SET_SCALE_TO',
      payload: (k,v) => v,
      default: 'total'
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
        let plot = {}
        plot.id = 'default'
        v.forEach(o=>{
          if (o.value){
            plot[o.index] = o.value
          }
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
      default: {}
      // keyed(window,'plot') ? (
      //   {x:getQueryValue('xField') || window.plot.x || null, y:getQueryValue('yField') || window.plot.y || null, z:getQueryValue('zField') || window.plot.z || null, cat:getQueryValue('catField') || window.plot.cat || null}
      // ) : (
      //   {x:getQueryValue('xField') || null, y:getQueryValue('yField') || null, z:getQueryValue('zField') || null ,cat:getQueryValue('catField') || null}
      // )

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
            byId[val.field].range[val.index == 'min' ? 0 : 1] = val.value*1
          }
          else if (val.index.match(/(lin|lax)/)){
            if (!keyed(byId[val.field],'limit')){
              byId[val.field].limit = []
            }
            byId[val.field].limit[val.index == 'lin' ? 0 : 1] = val.value*1
          }
          else {
            byId[val.field][val.index] = val.value
          }

        })
        Object.keys(byId).forEach(id =>{
          // TODO: this needs to only update if active is currently false
          // actions.push({
          //   type: 'EDIT_FIELD',
          //   payload: () => ({id,active:true})
          // })
          actions.push({
            type: 'EDIT_FILTER',
            payload: () => byId[id]
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
      default: window.plot ? window.plot.x : null
    },
    yField: {
      array: (k,v) => ({key:'axes',index:'y',value:v}),
      default: window.plot ? window.plot.y : null
    },
    zField: {
      array: (k,v) => ({key:'axes',index:'z',value:v}),
      default: window.plot ? window.plot.z : null
    },
    catField: {
      array: (k,v) => ({key:'axes',index:'cat',value:v}),
      default: window.plot ? window.plot.cat : null
    },
    Inv: {
      array: (k,v) => ({key:'filter',index:'invert',...v}),
      default: false
    },
    Active: {
      array: (k,v) => ({key:'field',index:'active',...v}),
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
    Clamp: {
      array: (k,v) => ({key:'field',index:'clamp',...v})
    },
    LimitMax: {
      array: (k,v) => ({key:'filter',index:'lax',...v}),
    },
    LimitMin: {
      array: (k,v) => ({key:'filter',index:'lin',...v}),
    },
    Keys: {
      array: (k,v) => ({key:'filter',field:v.field,index:'keys',value:(v.value ? v.value.split(',').map(x=>x*1) : [])}),
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
  return getQueryValue(param) || defaultValue(param)
}

export const queryToStore = (options = {}) => {
  return function (dispatch) {
    // dispatch({type:'RELOADING',payload:true})
    let batch = []
    let values = options.values || {}
    let searchReplace = options.searchReplace || false
    let currentHash = options.hash || history.location.hash || ''
    let currentSearch = options.currentSearch || history.location.search || ''
    let remove = options.remove || []
    let action = options.action || 'REPLACE'
    let arrays = {}
    let parsed = qs.parse(currentSearch.replace('?',''))
    Object.keys(parsed).forEach(key=>{
      if (parsed[key] == ''){
        delete parsed[key]
        remove.push(key)
      }
    })
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
    else if (searchReplace){
      Object.keys(mapDispatchToQuery).forEach(key=>{
        if (!keyed(values,key)){
          if (keyed(mapDispatchToQuery[key],'type')){
            remove.push(key)
          }
        }

      })
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
          //dispatch({type,payload})
          batch.push({type,payload})
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
          //dispatch({type,payload})
          batch.push({type,payload})
        })
        if (keyed(obj,'params')){
          let params = obj.params(key,value)
          Object.keys(params).forEach(k=>{parsed[k] = params[k]})
        }
      }
    })
    arrays = {}
    remove.forEach(key=>{
      let value = values[key]
      let [field,k] = key.split('--')
      delete parsed[key]
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
          let payload = action.default
          //dispatch({type,payload})
          batch.push({type,payload})
        })
      }
      else if (keyed(mapDispatchToQuery,k)){
        let obj = mapDispatchToQuery[k]
        if (keyed(obj,'array')){
          let entry = obj.array(k,value)
          if (!keyed(arrays,entry.key)){
            arrays[entry.key] = []
          }
          arrays[entry.key].push(entry)
        }
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
          //dispatch({type,payload})
          batch.push({type,payload})
        })
        if (keyed(obj,'params')){
          let params = obj.params(key,value)
          Object.keys(params).forEach(k=>{parsed[k] = params[k]})
        }
      }
    })

    let search = qs.stringify(parsed)
    if (search != currentSearch){
      if (action != 'POP'){
        history.push({hash:currentHash,search})
      }
      // else if (action == 'FILTER'){
      //   history.push({hash:currentHash,search})
      // }
      //dispatch({type:'SET_QUERY_STRING',payload:search})
      batch.push({type:'SET_QUERY_STRING',payload:search})
    }
    dispatch(batchActions(batch))
    return new Promise (resolve => resolve(parsed))
  }
}

export default queryToStore;
