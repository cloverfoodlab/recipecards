import 'babel-polyfill'
import axios from 'axios'
import axiosMiddleware from 'redux-axios-middleware'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux'

import recipes from './reducers'
import Recipe from './containers/Recipe'
import RecipesList from './containers/RecipesList'

const client = axios.create({
  baseURL:'/api',
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
    <Router>
      <div>
        <Route exact path="/" component={ RecipesList }/>
        <Route path="/recipe/(\d+)" component={ Recipe }/>
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
)
