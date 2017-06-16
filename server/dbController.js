const db = require("./db");
const fetcher = require("./fetcher");

/*
 * EXPOSE API ENDPOINTS TO HIT DB AND FETCH WHEN 404
 */

//endpoint which fetches from db for recipes data
const getRecipes = (req, res) => {
  db.getAllRecipes().then(result => {
    if (result.total_rows === 0) {
      console.log("no recipes found, force fetching");

      fetcher.populateMenuRecipes(() => {
        fetcher.populatePrepRecipes(() => {
          getRecipes(req, res);
        });
      });
    } else {
      const allRecipes = result.rows.map(row => row.doc);
      res.json({ recipes: allRecipes });
    }
  });
};

//endpoint which fetches from db for recipe data
const getRecipe = (req, res, isMenuRecipe) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    throw new Error("invalid id");
  }

  db
    .getRecipe(isMenuRecipe, id)
    .then(recipe => {
      //using inventory as an indicator of a force fetch
      if (recipe.inventory) {
        res.json(recipe);
      } else {
        console.log("recipe " + id + " not found, force fetching");

        fetcher.populateRecipe(id, isMenuRecipe, () => {
          db.getRecipe(isMenuRecipe, id).then(r => {
            res.json(r);
          });
        });
      }
    })
    .catch(err => {
      if (err.status !== 404) {
        throw err;
      }

      console.log("recipe " + id + " not found, force fetching");

      fetcher.populateRecipe(id, isMenuRecipe, () => {
        getRecipe(req, res, isMenuRecipe);
      });
    });
};

module.exports = {
  getRecipes,
  getRecipe
};
