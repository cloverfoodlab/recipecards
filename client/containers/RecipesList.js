import "babel-polyfill";
import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import Spinner from "react-spinkit";

import { loadRecipes } from "../actions";
import RecipeLink from "../components/RecipeLink";

class RecipesList extends Component {
  constructor(props) {
    super();
    props.onLoad();
  }

  render() {
    const { menuRecipes, prepRecipes, loaded } = this.props;

    const recStyle = {
      margin: "20px"
    };

    const h1Style = {
      fontSize: "18px",
      fontWeight: "bold",
      margin: "10px 0 5px 0"
    };

    if (loaded) {
      return (
        <div className="recipes" style={recStyle}>
          <div className="menu-recipes">
            <h1 style={h1Style}>Menu Recipes</h1>
            {menuRecipes.map(recipe => <RecipeLink {...recipe} />)}
          </div>
          <div className="prep-recipes">
            <h1 style={h1Style}>Prep Recipes</h1>
            {prepRecipes.map(recipe => <RecipeLink {...recipe} />)}
          </div>
        </div>
      );
    } else {
      return <Spinner name="spinner" />;
    }
  }
}

RecipesList.propTypes = {
  recipes: PropTypes.array.isRequired,
  onLoad: PropTypes.func,
  loaded: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    prepRecipes: state.recipeList.filter(r => !r.isMenuRecipe),
    menuRecipes: state.recipeList.filter(r => r.isMenuRecipe),
    loaded: state.loaded
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLoad: () => dispatch(loadRecipes())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipesList);
