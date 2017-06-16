import "babel-polyfill";
import React, { PropTypes } from "react";
import { Link } from "react-router-dom";

const Ingredient = ({
  itemId,
  quantity,
  unit,
  name,
  customUnit,
  isPrepRecipe
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

  const nameLink = isPrepRecipe
    ? <Link style={{ color: "black" }} to={"/prep_recipe/" + itemId}>
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
  isPrepRecipe: PropTypes.bool
};

export default Ingredient;
