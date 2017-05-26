import 'babel-polyfill'
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

const Recipe = ({recipe}) => {
  const {id, name, yieldAmount, description, ingredients, instructions} = recipe

  return (
    <div className="recipe">
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

Recipe.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  yieldAmount: PropTypes.number,
  description: PropTypes.string,
  ingredients: PropTypes.array,
  instructions: PropTypes.array
  //TODO: subrecipes how organize
}

const mapStateToProps = (state, ownProps) => {
  const urlId = parseInt(ownProps.match.params[0], 10)
  return {
    recipe: state.recipes.find(recipe => recipe.id === urlId)
  }
}

export default connect(
  mapStateToProps
)(Recipe)

