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
  if (isNaN(id)) {
    throw "invalid id";
  }

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
const fetchRecipesFromPeachworks = (callback, page = 1) => {
  peachworks.proxyGetRecipes(page).then(recipes => {
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
        if (recipes.length === 0) {
          callback();
        } else {
          fetchRecipesFromPeachworks(callback, page + 1);
        }
      });
  });
};

//pulls recipe data into db from peachworks
const fetchRecipeFromPeachworks = (id, callback) => {
  peachworks.proxyGetInventory(id).then(invJson => {
    let inventory = invJson.map(i => {
      return {
        //TODO: what is quantity vs common_quantity?
        quantity: parseFloat(i.quantity),
        itemId: i.item_id,
        unitId: i.unit_id
      };
    });

    peachworks.proxyGetInstructions(id).then(insJson => {
      const instructions = insJson.map(i => {
        return {
          content: i.content
        };
      });

      const itemIds = inventory.map(i => i.itemId);
      peachworks.proxyGetItems(itemIds).then(itemsJson => {
        inventory = inventory.map(i => {
          const item = itemsJson.find(item => i.itemId === item.id);
          return Object.assign(i, { name: item.name });
        });

        const unitIds = inventory.map(i => i.unitId);
        peachworks.proxyGetUnits(unitIds).then(unitsJson => {
          inventory = inventory.map(i => {
            const unit = unitsJson.find(unit => i.unitId === unit.id);
            return Object.assign(i, { unit: unit.abbr });
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
    });
  });
};

module.exports = {
  getRecipes: getRecipes,
  getRecipe: getRecipe
};
