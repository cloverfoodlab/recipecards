const defaultState = {
  recipeList: [],
  recipes: [
    //TODO: remove fake data when get actual thing working
      {
        id: 21,
        name: "test",
        yieldAmount: 1
      }
  ]
}

const recipes = (state = defaultState, action) => {
  switch (action.type) {
    case 'LOAD_RECIPES':
      console.log("loading recipes")

      return state
    case 'LOAD_RECIPES_SUCCESS':
      //TODO: process pages beyond the first one
      const recipesJson = action.payload.data.results
      const recipeList = recipesJson.map(recipe => {
        return { name: recipe.name, id: recipe.id }
      })

      return {...state, recipeList: recipeList}
    case 'LOAD_RECIPES_FAIL':
      console.log("error loading recipes: " + action.error)
      return state
    default:
      return {...state,
  /*
   * TODO: is there a nice way to map the key-value pairs for an object or something like that?
   * basically a clean way to pass to recipe function here,
   * while also making the mapStateToProps in containers/Recipe.js cleaner
   */
        recipes: state.recipes.map(r => recipe(r, action))
      }
  }
}

const recipe = (state, action) => {
  switch (action.type) {
    case 'LOAD_RECIPE':
      console.log("loading recipe")

      return state
    case 'LOAD_RECIPE_SUCCESS':
      console.log(action.payload)

      return {
        //TODO: include payload, currently a hack to display new fake data
        id: 12,
        name: "test",
        yield: 1
      }
    case 'LOAD_RECIPE_FAIL':
      console.log("error loading recipe: " + action.error)
      return state
    default:
      return state
  }
}

export default recipes
