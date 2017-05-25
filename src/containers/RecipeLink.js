import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { loadRecipe } from '../actions'

const RecipeLink = ({ id, name, onClick }) => {
  return (
    <Link
      to={ "/recipe/" + id }
      style={{
        textDecoration: 'none',
        color: "black"
      }}
    >
      <div onClick = {() => onClick(id)}>{ name }</div>
    </Link>
  )
}

RecipeLink.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  onClick: PropTypes.func
}

const mapStateToProps = (state) => {
  return { }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onClick: (id) => {
      dispatch(loadRecipe(id))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeLink)
