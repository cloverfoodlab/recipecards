export const loadRecipes = () => {
  return {
    type: 'LOAD_RECIPES',
    payload: {
      request: {
        url: '/wtm_recipes'
      }
    }
  }
}

export const loadRecipe = (id) => {
  return {
    type: 'LOAD_RECIPE',
    payload: {
      request: {
        url: '/wtm_recipes/' + id
      }
    }
  }
}
