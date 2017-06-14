const peachworks = require("./peachworks");
const PouchDb = require("pouchdb");
PouchDb.plugin(require("pouchdb-adapter-memory"));
PouchDb.plugin(require("pouchdb-upsert"));
PouchDb.plugin(require("relational-pouch"));

let db = new PouchDb("peachworks", { adapter: "memory" });

//endpoint which fetches from db for recipes data
const getRecipes = (req, res) => {
  //TODO: move this out into a cron job
  fetchMenuRecipesFromPeachworks(() => {
    fetchPrepRecipesFromPeachworks(() => {
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
  });
};

const dbId = (isMenuRecipe, id) => {
  return isMenuRecipe ? "recipe-menu-" + id : "recipe-prep-" + id;
};

//endpoint which fetches from db for recipe data
const getRecipe = (req, res, isMenuRecipe) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    throw new Error("invalid id");
  }

  const _id = dbId(isMenuRecipe, id);
  db
    .get(_id)
    .then(recipe => {
      //since we don't have a cron job yet, temporarily let's only fetch recipe once
      //using inventory as an indicator of a full fetch
      if (recipe.inventory) {
        res.json(recipe);
      } else {
        fetchRecipeFromPeachworks(id, isMenuRecipe, () => {
          db.get(_id).then(r => {
            res.json(r);
          });
        });
      }
    })
    .catch(err => {
      if (err.status !== 404) {
        throw err;
      }

      //TODO: move this out into a cron job
      fetchRecipeFromPeachworks(id, isMenuRecipe, () => {
        db.get(_id).then(recipe => {
          res.json(recipe);
        });
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

/*
 peachworks returns a terrible interface for instructions content,
 something along the lines of:

 "<p><ol><li>INSTRUCTION 1<br></li><li>INSTRUCTION 2<br></li></ol></p>"

 we want to convert this to ["INSTRUCTION 1", "INSTRUCTION 2"]
 */
const extractContent = html => {
  const newHtml = html
    .replace(/<br>/gi, "")
    .replace(/<\/p>/gi, "")
    .replace(/<p>/gi, "")
    .replace(/<ol>/gi, "")
    .replace(/<\/ol>/gi, "")
    .replace(/<\/li>/gi, "");

  return newHtml.split("<li>").filter(i => i !== "");
};

//pulls recipes data into db from peachworks
const fetchRecipesFromPeachworks = (
  peachworksApi,
  isMenuRecipe,
  callback,
  page = 1
) => {
  peachworksApi(page).then(recipes => {
    const idRecipes = recipes.map(recipe => {
      const _id = dbId(isMenuRecipe, recipe.id);
      return Object.assign({}, recipe, {
        _id: _id,
        isMenuRecipe: isMenuRecipe
      });
    });

    const noop = () => {};
    const promises = idRecipes.map(recipe => createOrUpdate(recipe, noop));

    Promise.all(promises)
      .catch(err => {
        throw err;
      })
      .then(values => {
        //callback only after we've fetched all pages
        if (recipes.length === 0) {
          callback();
        } else {
          fetchRecipesFromPeachworks(
            peachworksApi,
            isMenuRecipe,
            callback,
            page + 1
          );
        }
      });
  });
};

const fetchPrepRecipesFromPeachworks = (callback, page = 1) => {
  fetchRecipesFromPeachworks(
    peachworks.proxyGetPrepRecipes,
    false,
    () => {
      db
        .allDocs({
          startkey: "recipe-prep-",
          endkey: "recipe-prep-\uffff",
          include_docs: true
        })
        .then(result => {
          let prepRecipes = result.rows.map(row => {
            //already an array of objects
            if (
              row.doc.instructions &&
              typeof row.doc.instructions !== "string"
            ) {
              return row.doc;
            }

            //prep API has instructions at the recipe level... hooray for inconsistencies!
            const instructions = extractContent(
              row.doc.instructions || ""
            ).map(i => {
              return {
                content: i
              };
            });

            return Object.assign({}, row.doc, { instructions: instructions });
          });

          //name not included, so we gotta get those from the inv items
          const invIds = prepRecipes.map(recipe => recipe.inv_item_id);
          peachworks.proxyGetItems(invIds).then(json => {
            const jsonMap = new Map(json.map(j => [j.id, j]));

            //TODO: we should consider switching to the relational model...
            //especially if we want ingredients from menu recipes to link to the prep recipes
            prepRecipes = prepRecipes.map(recipe => {
              const invItem = jsonMap.get(recipe.inv_item_id);
              if (invItem) {
                return Object.assign({}, recipe, { name: invItem.name });
              } else {
                return recipe;
              }
            });

            //update db with our modifications to prep recipes
            db.bulkDocs(prepRecipes).then(() => {
              callback();
            });
          });
        });
    },
    page
  );
};

const fetchMenuRecipesFromPeachworks = (callback, page = 1) => {
  fetchRecipesFromPeachworks(
    peachworks.proxyGetMenuRecipes,
    true,
    callback,
    page
  );
};

//pulls recipe data into db from peachworks
const fetchRecipeFromPeachworks = (id, isMenuRecipe, callback) => {
  const invFunc = isMenuRecipe
    ? peachworks.proxyGetInventory
    : peachworks.proxyGetPrepInventory;
  const itemIdKey = isMenuRecipe ? "item_id" : "inv_item_id";

  invFunc(id).then(invJson => {
    let inventory = invJson.map(i => {
      return {
        quantity: parseFloat(i.quantity),
        itemId: i[itemIdKey],
        unitId: i.unit_id,
        customUnitId: i.each_unit_id
      };
    });

    const fetchForInv = (idKey, peachworksApi, invKey, jsonKey) => {
      const ids = inventory.map(i => i[idKey]).filter(i => i);

      return peachworksApi(ids).then(json => {
        const jsonMap = new Map(json.map(j => [j.id, j]));

        inventory = inventory.map(i => {
          if (i[idKey]) {
            const jsonItem = jsonMap.get(i[idKey]);
            //TODO this is pretty gross... any better way to do this? can't do assign since key is dynamic?
            i[invKey] = jsonItem[jsonKey];
          }
          return i;
        });
      });
    };

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
        if (isMenuRecipe) {
          peachworks.proxyGetInstructions(id).then(insJson => {
            const instructionsArray = insJson.map(i =>
              extractContent(i.content)
            );
            //basically flatMap
            const instructions = [].concat(...instructionsArray).map(i => {
              return {
                content: i
              };
            });

            const recipe = {
              _id: dbId(isMenuRecipe, id),
              id: id,
              inventory: inventory,
              instructions: instructions
            };

            createOrUpdate(recipe, callback);
          });
        } else {
          const recipe = {
            _id: dbId(isMenuRecipe, id),
            id: id,
            inventory: inventory
          };

          createOrUpdate(recipe, callback);
        }
      });
  });
};

module.exports = {
  getRecipes: getRecipes,
  getRecipe: getRecipe
};
