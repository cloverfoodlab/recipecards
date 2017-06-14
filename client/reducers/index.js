const defaultState = {
  recipeList: [],
  recipes: {}
};

const keyId = (id, isMenuRecipe) => {
  return isMenuRecipe ? "menu" + id : "prep" + id;
};

const recipes = (state = defaultState, action) => {
  switch (action.type) {
    case "LOAD_RECIPES":
      console.log("loading recipes");
      return state;

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
      if (!state.recipes[keyId(action.id, action.isMenuRecipe)]) {
        state.recipes[keyId(action.id, action.isMenuRecipe)] = {
          id: action.id,
          isMenuRecipe: action.isMenuRecipe,
          loaded: false
        };
      }

      return state;

    default:
      Object.keys(state.recipes).forEach(key => {
        state.recipes[key] = recipe(state.recipes[key], action);
      });

      return state;
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
