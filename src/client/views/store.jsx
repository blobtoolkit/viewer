import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers/root'
// import querySync from './querySync'

const loggerMiddleware = createLogger()

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    // loggerMiddleware // neat middleware that logs actions
  ),
  // querySync
)

export default store;
