import 'babel-polyfill'
import React, { PropTypes } from 'react'

const Ingredient = ({quantity, unit, name}) => {
  return (
    <div>{ quantity } { unit } - { name }</div>
  )
}

Ingredient.propTypes = {
  quantity: PropType.number,
  unit: PropType.string,
  name: PropType.string
}

export default Ingredient
