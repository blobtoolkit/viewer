import { createSelector } from 'reselect'
import { byIdSelectorCreator } from './selectorCreators'
import createHistory from 'history/createBrowserHistory';
import qs from 'qs'
export const history = createHistory();
export default history;

export const parseQueryString = createSelector(
  () => history,
  (hist) => {
    let currentQuery = hist.location.search || ''
    return qs.parse(currentQuery.replace('?',''))
  }
)

const createSelectorForQueryValue = byIdSelectorCreator();

const _getQueryIdAsMemoKey = (queryId) => {console.log(queryId); return queryId}

export const getQueryValue = createSelectorForQueryValue(
  _getQueryIdAsMemoKey,
  _getQueryIdAsMemoKey,
  parseQueryString,
  (id, parsed) => {
    console.log(parsed[id])
    return parsed[id]
  }
)
