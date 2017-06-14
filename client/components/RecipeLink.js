import React, { PropTypes } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

const RecipeLink = ({ id, name, isMenuRecipe }) => {
  const linkPrefix = isMenuRecipe ? "/menu_recipe/" : "/prep_recipe/";

  const style = {
    padding: "20px",
    fontSize: "24px",
    display: "inline-block",
    border: "1px solid #ccc",
    margin: "5px"
  };

  return (
    <Link
      to={linkPrefix + id}
      style={{
        textDecoration: "none",
        color: "black"
      }}
    >
      <div style={style}>{name}</div>
    </Link>
  );
};

RecipeLink.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  isMenuRecipe: PropTypes.bool
};

export default RecipeLink;
