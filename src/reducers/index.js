const defaultState = [
  { name: "recipe 1", id: 1 },
  { name: "recipe 2", id: 2 }
]

const recipes = (state = defaultState, action) => {
  switch (action.type) {
    case 'LOAD_RECIPES':
      console.log("loading recipes")

      return state
    case 'LOAD_RECIPES_SUCCESS':
      console.log(payload)

      return [...state,
        //TODO: include payload.???, currently a hack to display new fake data
        { name: "recipe 3", id: 3 }
      ]
    case 'LOAD_RECIPES_FAIL':
      //TODO: log failure, currently a hack to display new fake data
      console.log("loading recipes failed")

      return [...state,
        { name: "recipe 3", id: 3 }
      ]
    default:
      return state.map(r => recipe(r, action))
  }
}

const recipe = (state, action) => {
  switch (action.type) {
    case 'LOAD_RECIPE':
      console.log("loading recipe")

      return state
    case 'LOAD_RECIPE_SUCCESS':
      console.log(payload)

      return {
        //TODO: could've sworn spread operator worked in object also...
        //TODO: include payload.???, currently a hack to display new fake data
        name: state.name,
        id: state.id,
        recipe: {
          name: state.name,
          yield: 1
        }
      }
    case 'LOAD_RECIPE_FAIL':
      //TODO: log failure, currently a hack to display new fake data
      console.log("loading recipe failed")

      return {
        name: state.name,
        id: state.id,
        recipe: {
          name: state.name,
          yield: 1
        }
      }
    default:
      return state
  }
}

export default recipes
