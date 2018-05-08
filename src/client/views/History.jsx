import createHistory from 'history/createBrowserHistory';
import qs from 'qs'
export const history = createHistory();
export default history;

export const queryValue = (value,hist=history) => {
  let currentQuery = hist.location.search || ''
  let parsed = qs.parse(currentQuery.replace('?',''))
  if (parsed.hasOwnProperty(value) && parsed[value] != 'false'){
    return parsed[value]
  }
  return false
}

export const addQueryValues = (values,hist=history) => {
  let currentSearch = hist.location.search || ''
  let currentHash = hist.location.hash || ''
  let parsed = qs.parse(currentSearch.replace('?',''))
  Object.keys(values).forEach(key => {
    parsed[key] = values[key]
  })
  hist.push({hash:currentHash,search:qs.stringify(parsed)})
}

export const hashValue = (hist=history) => {
  let currentHash = hist.location.hash || ''
  return currentHash.replace('#','')
}

export const toggleHash = (value,hist=history) => {
  let currentHash = hashValue()
  let currentQuery = hist.location.search || ''
  if (currentHash && currentHash == value){
    hist.push({hash:'',search:currentQuery})
  }
  else {
    hist.push({hash:'#'+value,search:currentQuery})
  }
}
