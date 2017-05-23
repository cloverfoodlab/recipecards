import { connect } from 'react-redux'

import RecipeList from '../components/RecipeList'
import { loadRecipes } from '../actions'

const mapStateToProps = (state) => {
  return {
    recipes: state
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: () => dispatch(loadRecipes())
  }
}

const RecipesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeList)

export default RecipesContainer
