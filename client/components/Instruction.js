import "babel-polyfill";
import PropTypes from "prop-types";
import React from "react";

const Instruction = ({ content }) => {
  const style = {
    margin: "5px 0"
  };
  return (
    <div
      className="instruction"
      style={style}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

Instruction.propTypes = {
  content: PropTypes.string
};

export default Instruction;
