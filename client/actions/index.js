export const loadRecipes = () => {
  return {
    type: "LOAD_RECIPES",
    payload: {
      request: {
        url: "/recipes"
      }
    }
  };
};

export const loadRecipe = (id, isMenuRecipe) => {
  const urlPrefix = isMenuRecipe ? "/menu_recipe/" : "/prep_recipe/";

  return {
    type: "LOAD_RECIPE",
    id,
    isMenuRecipe,
    payload: {
      request: {
        url: urlPrefix + id
      }
    }
  };
};

export const filterRecipes = str => {
  return {
    type: "FILTER_RECIPES",
    str
  };
};
