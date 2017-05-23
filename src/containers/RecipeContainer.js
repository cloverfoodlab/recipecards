import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'

import Recipe from '../components/Recipe'
import { loadRecipe } from '../actions'

//TODO: should this load another page or a modal with the recipe?
const displayRecipe = (id, recipe) => {
  console.log("displaying " + recipe)

  render(
    /*
     * TODO: how get this to update when state updates?
     * displayRecipe happens sync while API loading is async
     * so this currently displays undefined and needs a second click
     * to display the results from the API load...
     */
    <Recipe { ...recipe } />,
    document.getElementById("recipe-" + id)
  )
}

class RecipeContainer extends Component {
  render() {
    const { id, name, recipe, onClick } = this.props

    return (
      <div>
        <div onClick = {() => onClick(id, recipe)}>{ name }</div>
        <div id={ "recipe-" + id }></div>
      </div>
    )
  }
}

RecipeContainer.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  recipe: PropTypes.object,
  onClick: PropTypes.func
}

const mapStateToProps = (state) => {
  return { }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onClick: (id, recipe) => {
      dispatch(loadRecipe(id))
      displayRecipe(id, recipe)
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeContainer)
