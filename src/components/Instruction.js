import "babel-polyfill";
import React, { PropTypes } from "react";

const Instruction = ({ content }) => {
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
};

Instruction.propTypes = {
  content: PropTypes.string
};

export default Instruction;
