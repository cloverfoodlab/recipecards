import 'babel-polyfill'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { loadRecipes } from '../actions'
import RecipeLink from '../components/RecipeLink'

class RecipesList extends Component {
  constructor(props) {
    super()
    props.onLoad()
  }

  render() {
    const { recipes } = this.props
    return (
      <div className="recipes">
        <h1>Recipes</h1>
        { recipes.map(recipe => <RecipeLink { ...recipe } />) }
      </div>
    )
  }
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
