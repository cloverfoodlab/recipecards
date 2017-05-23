import 'babel-polyfill'
import React, { PropTypes } from 'react'

const Recipe = ({name, yieldAmount, description, ingredients, instructions}) => {
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
  name: PropTypes.string,
  yield: PropTypes.number,
  description: PropTypes.string,
  ingredients: PropTypes.array,
  instructions: PropTypes.array
  //TODO: subrecipes how organize
}

export default Recipe
