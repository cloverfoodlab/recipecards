import 'babel-polyfill'
import React, { PropTypes } from 'react'

import RecipeContainer from '../containers/RecipeContainer'

const RecipeList = ({ recipes, onLoad }) => {
  return (
    <div className="recipes">
      <h1>Recipes</h1>
      <button onClick={onLoad}>Load Recipes</button>
      { recipes.map(recipe => <RecipeContainer { ...recipe } />) }
    </div>
  )
}

RecipeList.propTypes = {
  recipes: PropTypes.array.isRequired,
  onLoad: PropTypes.func
}

export default RecipeList
