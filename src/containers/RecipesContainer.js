import { connect } from 'react-redux'

import Recipes from '../components/Recipes'
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
)(Recipes)

export default RecipesContainer
