import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { loadRecipes } from '../actions'
import RecipeLink from './RecipeLink'

const RecipesList = ({ recipes, onLoad }) => {
  return (
    <div className="recipes">
      <h1>Recipes</h1>
      <button onClick={onLoad}>Load Recipes</button>
      { recipes.map(recipe => <RecipeLink { ...recipe } />) }
    </div>
  )
}

RecipesList.propTypes = {
  recipes: PropTypes.array.isRequired,
  onLoad: PropTypes.func
}

const mapStateToProps = (state) => {
  return {
    recipes: state.recipeList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: () => dispatch(loadRecipes())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipesList)
