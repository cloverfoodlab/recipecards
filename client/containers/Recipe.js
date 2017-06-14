import "babel-polyfill";
import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

import { loadRecipe } from "../actions";
import Ingredient from "../components/Ingredient";
import Instruction from "../components/Instruction";

class Recipe extends Component {
  constructor(props) {
    super();
    props.onLoad(props.recipe.id);
  }

  render() {
    const {
      id,
      name,
      yieldAmount,
      description,
      inventory,
      instructions
    } = this.props.recipe;

    const recStyle = {
      margin: "20px"
    };

    const ingStyle = {
      margin: "10px 0"
    };

    const h1Style = {
      fontWeight: "bold",
      margin: "0 0 5px 0"
    };

    return (
      <div style={recStyle} className="recipe" onLoad={() => onLoad(id)}>
        <h1 style={h1Style}>Name: {name}</h1>
        <h1 style={h1Style}>Yield: {yieldAmount}</h1>
        <div>{description}</div>
        <div className="ingredients" style={ingStyle}>
          <h1 style={h1Style}>Ingredients:</h1>
          {inventory && inventory.map(i => <Ingredient {...i} />)}
        </div>
        <div className="instructions">
          <h1 style={h1Style}>Method of Prep:</h1>
          {instructions && instructions.map(i => <Instruction {...i} />)}
        </div>
      </div>
    );
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
};

const mapStateToProps = (state, ownProps) => {
  const urlId = parseInt(ownProps.match.params[0], 10);
  return {
    recipe: state.recipes.find(recipe => recipe.id === urlId) || { id: urlId }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLoad: id => {
      dispatch(loadRecipe(id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Recipe);
