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
