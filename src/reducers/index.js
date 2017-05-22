const defaultState = [
  "recipe1",
  "recipe2"
]

const recipes = (state = defaultState, action) => {
  switch (action.type) {
    case 'LOAD_RECIPES':
      console.log("loading recipes")

      return state
    case 'LOAD_RECIPES_SUCCESS':
      console.log(payload)

      return [...state,
        "recipe3"
        //include payload.???
      ]
    default:
      return state
  }
}

export default recipes
