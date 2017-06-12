import React, { PropTypes } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

const RecipeLink = ({ id, name }) => {
  return (
    <Link
      to={"/recipe/" + id}
      style={{
        textDecoration: "none",
        color: "black"
      }}
    >
      <div>{name}</div>
    </Link>
  );
};

RecipeLink.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string
};

export default RecipeLink;
