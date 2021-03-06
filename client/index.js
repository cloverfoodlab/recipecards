import "babel-polyfill";
import axios from "axios";
import axiosMiddleware from "redux-axios-middleware";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import thunk from "redux-thunk";
import { createStore, applyMiddleware, compose } from "redux";

import recipes from "./reducers";
import Recipe from "./containers/Recipe";
import RecipesList from "./containers/RecipesList";

const client = axios.create({
  baseURL: "/api",
  responseType: "json"
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let store = createStore(
  recipes,
  composeEnhancers(applyMiddleware(axiosMiddleware(client), thunk))
);

render(
  <Provider store={store}>
    <Router>
      <div>
        <Route exact path="/" component={RecipesList} />
        <Route path="/(\S+)_recipe/(\d+)" component={Recipe} />
      </div>
    </Router>
  </Provider>,
  document.getElementById("root")
);
