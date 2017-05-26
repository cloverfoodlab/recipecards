const defaultState = []

const recipes = (state = defaultState, action) => {
  switch (action.type) {
    case 'LOAD_RECIPES':
      console.log("loading recipes")

      return state
    case 'LOAD_RECIPES_SUCCESS':
      //TODO: process pages beyond the first one
      const recipesJson = action.payload.data.results
      const newRecipes = recipesJson.map(recipe => {
        return { name: recipe.name, id: recipe.id }
      })

      return state.concat(newRecipes)
    case 'LOAD_RECIPES_FAIL':
      console.log("error loading recipes: " + action.error)
      return state
    default:
      return state.map(r => recipe(r, action))
  }
}

const recipe = (state, action) => {
  switch (action.type) {
    case 'LOAD_RECIPE':
      console.log("loading recipe")

      return state
    case 'LOAD_RECIPE_SUCCESS':
      console.log("loading recipe success")

      return {...state,
        //TODO: include payload, currently a hack to display new fake data
        recipe: {
          name: state.name,
          yield: 1
        }
      }
    case 'LOAD_RECIPE_FAIL':
      console.log("error loading recipe: " + action.error)
      return state
    default:
      return state
  }
}

export default recipes
