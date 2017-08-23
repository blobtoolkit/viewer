import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { fetchRepository } from './actions/repository'
import { selectDataset, fetchMeta } from './actions/dataset'
import rootReducer from './reducers/root'
import App from './components/App';
import 'babel-polyfill'


const loggerMiddleware = createLogger()

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
)



render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('app')
)

store.dispatch(fetchRepository())


// store
//   .dispatch(fetchMeta('ds3'))
//   .then(() => console.log(store.getState()))
