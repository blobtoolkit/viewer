import { createSelector } from 'reselect'
import { byIdSelectorCreator } from './selectorCreators'
import createHistory from 'history/createBrowserHistory';
import qs from 'qs'
const basename = BASENAME || ''
export const history = createHistory({
  basename
})

export default history;
