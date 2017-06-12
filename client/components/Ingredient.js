import "babel-polyfill";
import React, { PropTypes } from "react";

const Ingredient = ({ quantity, unit, name, customUnit }) => {
  const wholeUnit = customUnit ? customUnit : unit;
  return <div>{quantity} {wholeUnit} {name}</div>;
};

Ingredient.propTypes = {
  quantity: PropTypes.number,
  unit: PropTypes.string,
  name: PropTypes.string,
  customUnit: PropTypes.string
};

export default Ingredient;
