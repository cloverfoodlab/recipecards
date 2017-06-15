import "babel-polyfill";
import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import Spinner from "react-spinkit";

import { loadRecipes, filterRecipes } from "../actions";
import RecipeLink from "../components/RecipeLink";

class RecipesList extends Component {
  constructor(props) {
    super();
    props.onLoad();
  }

  render() {
    const { menuRecipes, prepRecipes, loaded, onChange } = this.props;

    const recStyle = {
      margin: "20px"
    };

    const searchStyle = {
      fontSize: "30px",
      padding: "10px",
      width: "80%"
    };

    const h1Style = {
      fontSize: "30px",
      fontWeight: "bold",
      margin: "30px 0 10px 5px"
    };

    if (loaded) {
      return (
        <div className="recipes" style={recStyle}>
          <input
            style={searchStyle}
            type="text"
            placeholder="Search for recipes"
            onChange={e => onChange(e.target.value)}
          />
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
  onChange: PropTypes.func,
  loaded: PropTypes.bool
};

const mapStateToProps = state => {
  const filter = state.filter.toLowerCase();
  return {
    prepRecipes: state.recipeList.filter(
      r => !r.isMenuRecipe && r.name.toLowerCase().match(filter)
    ),
    menuRecipes: state.recipeList.filter(
      r => r.isMenuRecipe && r.name.toLowerCase().match(filter)
    ),
    loaded: state.loaded
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLoad: () => dispatch(loadRecipes()),
    onChange: str => dispatch(filterRecipes(str))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipesList);
