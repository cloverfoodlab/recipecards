const defaultState = {
  recipeList: [],
  recipes: []
}

const recipes = (state = defaultState, action) => {
  switch (action.type) {
    case 'LOAD_RECIPES':
      console.log("loading recipes")
      return state

    case 'LOAD_RECIPES_SUCCESS':
      //TODO: process pages beyond the first one
      const recipesJson = action.payload.data.json.results
      const recipeList = recipesJson.map(recipe => {
        return { name: recipe.name, id: recipe.id }
      })
      return {...state, recipeList: recipeList}

    case 'LOAD_RECIPES_FAIL':
      console.log("error loading recipes: " + action.error)
      return state

    case 'LOAD_RECIPE':
      console.log("loading recipe")
      return state

    case 'LOAD_RECIPE_SUCCESS':
      console.log(action.payload)
      return {...state,
        recipes: [...state.recipes,
          {

          }
        ]
        /*
         * TODO: convert action.payload into
         * name,
         * yieldAmount,
         * description,
         * ingredients,
         * instructions
         */
      }

    case 'LOAD_RECIPE_FAIL':
      console.log("error loading recipe: " + action.error)
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
    default:
      return state
  }
}

export default recipes
