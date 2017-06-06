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

export const loadInventory = (id) => {
  return {
    type: 'LOAD_INVENTORY',
    id: id,
    payload: {
      request: {
        url: '/inventory/' + id
      }
    }
  }
}

export const loadInstructions = (id) => {
  return {
    type: 'LOAD_INSTRUCTIONS',
    id: id,
    payload: {
      request: {
        url: '/instructions/' + id
      }
    }
  }
}

export const loadRecipe = (id) => {
  return function (dispatch) {
    return Promise.all([
      //TODO: after load inventory, load inventory items
      dispatch(loadInventory(id)),
      dispatch(loadInstructions(id))
    ])
  }
}
