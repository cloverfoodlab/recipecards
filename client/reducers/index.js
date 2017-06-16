const defaultState = {
  recipeList: [],
  recipes: {},
  filter: ""
};

const keyId = (id, isMenuRecipe) => {
  return isMenuRecipe ? "menu" + id : "prep" + id;
};

let newState = {};

const recipes = (state = defaultState, action) => {
  switch (action.type) {
    case "FILTER_RECIPES":
      return {
        ...state,
        filter: action.str
      };

    case "LOAD_RECIPES":
      //anytime we load something new, clear the filter
      return {
        ...state,
        filter: ""
      };

    case "LOAD_RECIPES_SUCCESS":
      //TODO: process pages beyond the first one
      const recipesJson = action.payload.data.recipes;
      const recipeList = recipesJson.map(recipe => {
        return {
          name: recipe.name,
          id: recipe.id,
          isMenuRecipe: recipe.isMenuRecipe
        };
      });
      return { ...state, recipeList: recipeList, loaded: true };

    case "LOAD_RECIPES_FAIL":
      console.log("error loading recipes: " + action.error);
      return state;

    case "LOAD_RECIPE":
      newState = Object.assign({}, state);
      if (!newState.recipes[keyId(action.id, action.isMenuRecipe)]) {
        newState.recipes[keyId(action.id, action.isMenuRecipe)] = {
          id: action.id,
          isMenuRecipe: action.isMenuRecipe,
          loaded: false
        };
      }

      //anytime we load something new, clear the filter
      newState.filter = "";
      return newState;

    default:
      newState = Object.assign({}, state);

      Object.keys(newState.recipes).forEach(key => {
        newState.recipes[key] = recipe(newState.recipes[key], action);
      });

      return newState;
  }
};

const recipe = (state, action) => {
  switch (action.type) {
    case "LOAD_RECIPE_SUCCESS":
      return { ...action.payload.data, ...state, loaded: true };

    case "LOAD_RECIPE_FAIL":
      console.log("error loading recipe: " + action.error);
      return state;

    default:
      return state;
  }
};

export default recipes;
