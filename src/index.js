import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import recipes from './reducers'
import RecipesContainer from './containers/RecipesContainer'

let store = createStore(recipes)

render(
  <Provider store= { store }>
    <RecipesContainer />
  </Provider>,
  document.getElementById('root')
);

