import "babel-polyfill";
import React, { PropTypes } from "react";

const Ingredient = ({ quantity, unit, name, customUnit }) => {
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

  const wholeUnit = (customUnit ? customUnit : unit).toLowerCase();
  return (
    <div className="ingredient" style={style}>
      <span style={unitStyle}>{quantity} {wholeUnit}</span>
      <span style={nameStyle}>{name}</span>
    </div>
  );
};

Ingredient.propTypes = {
  quantity: PropTypes.number,
  unit: PropTypes.string,
  name: PropTypes.string,
  customUnit: PropTypes.string
};

export default Ingredient;
