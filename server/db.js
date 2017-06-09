const peachworks = require("./peachworks");
const pouchDb = require("pouchdb");
pouchDb.plugin(require("pouchdb-adapter-memory"));
pouchDb.plugin(require("relational-pouch"));

let db = new pouchDb("peachworks", { adapter: "memory" });

//endpoint which fetches from db for recipes data
const getRecipes = (req, res) => {
  //TODO: move this out into a cron job
  fetchRecipesFromPeachworks(() => {
    db.get("recipes").then(doc => {
      res.json(doc.recipes);
    });
  });
};

//endpoint which fetches from db for recipe data
const getRecipe = (req, res) => {
  const id = req.params.id;

  //TODO: move this out into a cron job
  fetchRecipeFromPeachworks(id, () => {
    db.get("recipe-" + id).then(doc => {
      res.json(doc.recipe);
    });
  });
};

const createOrUpdate = (doc, callback) => {
  db
    .get(doc._id)
    .then(_doc => {
      doc._rev = _doc._rev;
      db.put(doc);
    })
    .catch(err => {
      if (err.status === 404) {
        db.put(doc);
      } else {
        throw err;
      }
    })
    .then(() => callback());
};

//pulls recipes data into db from peachworks
const fetchRecipesFromPeachworks = callback => {
  peachworks.proxyGetRecipes().then(recipes => {
    createOrUpdate(
      {
        _id: "recipes",
        recipes: recipes
      },
      callback
    );
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
        id: id,
        inventory: inventory,
        instructions: instructions
      };

      createOrUpdate(
        {
          _id: "recipe-" + id,
          recipe: recipe
        },
        callback
      );
    });
  });
};

module.exports = {
  getRecipes: getRecipes,
  getRecipe: getRecipe
};
