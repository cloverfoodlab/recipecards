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

    //using load inventory as signal that we're loading recipe
    case 'LOAD_INVENTORY':
      if (state.recipes.find(recipe => recipe.id === action.id)) {
        return state
      } else {
        return {...state,
          recipes: [...state.recipes,
            {
              id: action.id
            }
          ]
        }
      }

    default:
      return {...state,
  /*
   * TODO: is there a nice way to map the key-value pairs for an object or something like that?
   * basically a clean way to pass to recipe function here,
   * while also making LOAD_INVENTORY and the mapStateToProps in containers/Recipe.js cleaner
   */
        recipes: state.recipes.map(r => recipe(r, action))
      }
  }
}

const recipe = (state, action) => {
  switch (action.type) {
    case 'LOAD_INVENTORY_SUCCESS':
      console.log(action.payload);
      const ingredientsJson = action.payload.data.json.results;
      const ingredientsData = ingredientsJson.map(i => {
        return {
          quantity: i.common_quantity,
          unit: i.common_unit_id //TODO: convert to human readable,
          //name: TODO
        }
      });

      return {...state,
        ingredients: ingredientsData
      }

    case 'LOAD_INVENTORY_FAIL':
      console.log("error loading inventory: " + action.error)
      return state

    case 'LOAD_INSTRUCTIONS_SUCCESS':
      console.log(action.payload)
      const instructionsJson = action.payload.data.json.results
      const instructionsData = instructionsJson.map(i => {
        return {
          //TODO: this is hilariously in terrible html
          content: i.content
        }
      })

      return {...state,
        instructions: instructionsData
      }

    case 'LOAD_INSTRUCTIONS_FAIL':
      console.log("error loading instructions: " + action.error)
      return state

    default:
      return state
  }
}

export default recipes
