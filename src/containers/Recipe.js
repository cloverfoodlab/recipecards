import 'babel-polyfill'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { loadRecipe } from '../actions'
import Ingredient from '../components/Ingredient'
import Instruction from '../components/Instruction'

class Recipe extends Component {
  constructor(props) {
    super()
    props.onLoad(props.recipe.id)
  }

  render() {
    const {id, name, yieldAmount, description, ingredients, instructions} = this.props.recipe

    return (
      <div className="recipe" onLoad={ () => onLoad(id) }>
        <div>Name: { name }</div>
        <div>Yield: { yieldAmount }</div>
        <div>{ description }</div>
        <div className="ingredients">
          <div>Ingredients</div>
          { ingredients && ingredients.map(ingredient => <Ingredient { ...ingredient } />) }
        </div>
        <div className="instructions">
          <div>Method of Prep</div>
          { instructions && instructions.map(instruction => <Instruction { ...instruction } />) }
        </div>
      </div>
    )
  }
}

Recipe.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  yieldAmount: PropTypes.number,
  description: PropTypes.string,
  ingredients: PropTypes.array,
  instructions: PropTypes.array,
  onLoad: PropTypes.func
  //TODO: subrecipes how organize
}

const mapStateToProps = (state, ownProps) => {
  const urlId = parseInt(ownProps.match.params[0], 10)
  return {
    recipe: state.recipes.find(recipe => recipe.id === urlId) || { id: urlId }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: (id) => {
      dispatch(loadRecipe(id))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Recipe)

