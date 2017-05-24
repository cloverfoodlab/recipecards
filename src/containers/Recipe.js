import 'babel-polyfill'
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

const Recipe = ({id, name, yieldAmount, description, ingredients, instructions}) => {
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
  yield: PropTypes.number,
  description: PropTypes.string,
  ingredients: PropTypes.array,
  instructions: PropTypes.array
  //TODO: subrecipes how organize
}

const mapStateToProps = (state, ownProps) => {
  return {
    //TODO: how load just this one id's recipe state from url..?
    recipes: state
  }
}

export default connect(
  mapStateToProps
)(Recipe)

