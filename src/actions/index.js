export const loadRecipes = () => {
  return {
    type: 'LOAD_RECIPES',
    payload: {
      request: {
        url: '/recipes'
      }
    }
  }
}

export const loadRecipe = (id) => {
  return {
    type: 'LOAD_RECIPE',
    id: id,
    payload: {
      request: {
        url: '/recipe/' + id
      }
    }
  }
}
