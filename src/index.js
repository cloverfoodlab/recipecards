import 'babel-polyfill'
import axios from 'axios'
import axiosMiddleware from 'redux-axios-middleware'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'

import recipes from './reducers'
import RecipesContainer from './containers/RecipesContainer'

const client = axios.create({
  baseURL:'api',
  responseType: 'json'
});
let store = createStore(
  recipes,
  applyMiddleware(
    axiosMiddleware(client)
  )
)

render(
  <Provider store= { store }>
    <RecipesContainer />
  </Provider>,
  document.getElementById('root')
)
