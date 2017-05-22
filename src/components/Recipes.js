import 'babel-polyfill'
import React from 'react'

import Recipe from './Recipe'

const Recipes = ({ recipes }) => {
  return (
    <div className="recipes">
      <h1>Recipes</h1>
      { recipes.map(recipe => <Recipe { ...recipe } />) }
    </div>
  )
}

export default Recipes
