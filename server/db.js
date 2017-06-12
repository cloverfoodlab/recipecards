const peachworks = require("./peachworks");
const PouchDb = require("pouchdb");
PouchDb.plugin(require("pouchdb-adapter-memory"));
PouchDb.plugin(require("pouchdb-upsert"));
PouchDb.plugin(require("relational-pouch"));

let db = new PouchDb("peachworks", { adapter: "memory" });

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
    throw new Error("invalid id");
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
        quantity: parseFloat(i.quantity),
        itemId: i.item_id,
        unitId: i.unit_id,
        customUnitId: i.each_unit_id
      };
    });

    const fetchForInv = (idKey, peachworksApi, invKey, jsonKey) => {
      const ids = inventory.map(i => i[idKey]).filter(i => i);

      return peachworksApi(ids).then(json => {
        inventory = inventory.map(i => {
          if (i[idKey]) {
            const jsonItem = json.find(j => i[idKey] === j.id);
            //TODO this is pretty gross... any better way to do this?
            i[invKey] = jsonItem[jsonKey];
          }
          return i;
        });
      });
    };

    peachworks.proxyGetInstructions(id).then(insJson => {
      const instructions = insJson.map(i => {
        return {
          content: i.content
        };
      });

      const promises = [
        fetchForInv("itemId", peachworks.proxyGetItems, "name", "name"),
        fetchForInv("unitId", peachworks.proxyGetUnits, "unit", "name"),
        fetchForInv(
          "customUnitId",
          peachworks.proxyGetCustomUnits,
          "customUnit",
          "description"
        )
      ];

      Promise.all(promises)
        .catch(err => {
          throw err;
        })
        .then(values => {
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
};

module.exports = {
  getRecipes: getRecipes,
  getRecipe: getRecipe
};
