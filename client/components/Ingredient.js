import "babel-polyfill";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";

const Ingredient = ({
  itemId,
  quantity,
  unit,
  name,
  customUnit,
  prepRecipeId
}) => {
  const style = {
    margin: "3px 0"
  };
  const unitStyle = {
    color: "#333"
  };
  const nameStyle = {
    fontWeight: "bold",
    margin: "0 0 0 5px"
  };

  const nameLink = prepRecipeId
    ? <Link style={{ color: "black" }} to={"/prep_recipe/" + prepRecipeId}>
        {name}
      </Link>
    : name;

  const wholeUnit = (customUnit ? customUnit : unit).toLowerCase();
  return (
    <div className="ingredient" style={style}>
      <span style={unitStyle}>{quantity} {wholeUnit}</span>
      <span style={nameStyle}>{nameLink}</span>
    </div>
  );
};

Ingredient.propTypes = {
  itemId: PropTypes.number,
  quantity: PropTypes.number,
  unit: PropTypes.string,
  name: PropTypes.string,
  customUnit: PropTypes.string,
  prepRecipeId: PropTypes.number
};

export default Ingredient;
