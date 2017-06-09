const peachworks = require("./peachworks");
const pouchDb = require("pouchdb");
pouchDb.plugin(require("pouchdb-adapter-memory"));
pouchDb.plugin(require("pouchdb-upsert"));
pouchDb.plugin(require("relational-pouch"));

let db = new pouchDb("peachworks", { adapter: "memory" });

//endpoint which fetches from db for recipes data
const getRecipes = (req, res) => {
  //TODO: move this out into a cron job
  fetchRecipesFromPeachworks(() => {
    db
      .allDocs({
        startkey: "recipe-",
        endkey: "recipe-\uffff",
        include_docs: true
      })
      .then(result => {
        const allRecipes = result.rows.map(row => row.doc);
        res.json({ recipes: allRecipes });
      });
  });
};

//endpoint which fetches from db for recipe data
const getRecipe = (req, res) => {
  const id = parseInt(req.params.id, 10);

  //TODO: move this out into a cron job
  fetchRecipeFromPeachworks(id, () => {
    db.get("recipe-" + id).then(doc => {
      res.json(doc);
    });
  });
};

const createOrUpdate = (newDoc, callback) => {
  db
    .upsert(newDoc._id, storedDoc => {
      return Object.assign({}, storedDoc, newDoc);
    })
    .catch(err => {
      throw err;
    })
    .then(res => {
      callback();
    });
};

//pulls recipes data into db from peachworks
const fetchRecipesFromPeachworks = callback => {
  peachworks.proxyGetRecipes().then(recipesJson => {
    const recipes = recipesJson.json.results;
    const idRecipes = recipes.map(recipe => {
      const recipeId = "recipe-" + recipe.id;
      return Object.assign({}, recipe, { _id: recipeId });
    });

    const noop = () => {};
    const promises = idRecipes.map(recipe => createOrUpdate(recipe, noop));

    Promise.all(promises)
      .catch(err => {
        throw err;
      })
      .then(values => {
        callback();
      });
  });
};

//pulls recipe data into db from peachworks
const fetchRecipeFromPeachworks = (id, callback) => {
  peachworks.proxyGetInventory(id).then(invJson => {
    peachworks.proxyGetInstructions(id).then(insJson => {
      const inventory = invJson.json.results.map(i => {
        return {
          quantity: i.common_quantity,
          unit: i.common_unit_id
        };
      });
      const instructions = insJson.json.results.map(i => {
        return {
          content: i.content
        };
      });
      const recipe = {
        _id: "recipe-" + id,
        id: id,
        inventory: inventory,
        instructions: instructions
      };

      createOrUpdate(recipe, callback);
    });
  });
};

module.exports = {
  getRecipes: getRecipes,
  getRecipe: getRecipe
};
