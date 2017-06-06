import 'babel-polyfill'
import React, { PropTypes } from 'react'

const Ingredient = ({quantity, unit, name}) => {
  return (
    <div>{ quantity } { unit } - { name }</div>
  )
}

Ingredient.propTypes = {
  quantity: PropTypes.number,
  unit: PropTypes.string,
  name: PropTypes.string
}

export default Ingredient
