import 'babel-polyfill'
import React, { PropTypes } from 'react'

const Instruction = ({content}) => {
  return (
    <div>{ content }</div>
  )
}

Instruction.propTypes = {
  content: PropTypes.string
}

export default Ingredient
