import 'babel-polyfill'
import React from 'react'

import Recipe from './Recipe'

const Recipes = ({ recipes, onLoad }) => {
  return (
    <div className="recipes">
      <h1>Recipes</h1>
      <button onClick={onLoad}>Load Recipes</button>
      { recipes.map(recipe => <Recipe { ...recipe } />) }
    </div>
  )
}

export default Recipes
