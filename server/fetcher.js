const peachworks = require("./peachworks");
const db = require("./db");

/*
 * FETCH DATA INTO DB FROM PEACHWORKS
 */

const noop = () => {};

//pulls recipes data into db from peachworks
const populateRecipes = (peachworksApi, isMenuRecipe, callback, page = 1) => {
  peachworksApi(page).then(recipes => {
    const idRecipes = recipes.map(recipe => {
      return Object.assign({}, recipe, {
        id: recipe.id,
        isMenuRecipe: isMenuRecipe
      });
    });

    const promises = idRecipes.map(recipe => db.upsertRecipe(recipe, noop));

    Promise.all(promises)
      .catch(err => {
        throw err;
      })
      .then(values => {
        //callback only after we've fetched all pages
        if (recipes.length === 0) {
          callback();
        } else {
          populateRecipes(peachworksApi, isMenuRecipe, callback, page + 1);
        }
      });
  });
};

const populatePrepRecipes = (callback, page = 1) => {
  populateRecipes(
    peachworks.proxyGetPrepRecipes,
    false,
    () => {
      db.getPrepRecipes().then(result => {
        let prepRecipes = result.rows.map(row => {
          //prep API has instructions at the recipe level... hooray for inconsistencies!
          const instructions = [
            {
              content: row.doc.instructions,
              id: row.doc.id
            }
          ];

          return Object.assign({}, row.doc, {
            instructions: instructions,
            prepId: row.doc.id
          });
        });

        //name not included, so we gotta get those from the inv items
        const invIds = prepRecipes.map(recipe => recipe.inv_item_id);
        peachworks.proxyGetItems(invIds).then(json => {
          const jsonMap = new Map(json.map(j => [j.id, j]));

          prepRecipes = prepRecipes.map(recipe => {
            const invItem = jsonMap.get(recipe.inv_item_id);
            if (invItem) {
              return Object.assign({}, recipe, { name: invItem.name });
            } else {
              return recipe;
            }
          });

          //update db with our modifications to prep recipes
          db.bulkUpdate(prepRecipes).then(() => {
            callback();
          });
        });
      });
    },
    page
  );
};

const populateMenuRecipes = (callback, page = 1) => {
  populateRecipes(peachworks.proxyGetMenuRecipes, true, callback, page);
};

//pulls recipe data into db from peachworks
const populateRecipe = (id, isMenuRecipe, callback) => {
  const invFunc = isMenuRecipe
    ? peachworks.proxyGetInventory
    : peachworks.proxyGetPrepInventory;
  const itemIdKey = isMenuRecipe ? "item_id" : "inv_item_id";

  invFunc(id).then(invJson => {
    let inventory = invJson.map(i => {
      return {
        quantity: parseFloat(i.quantity),
        position: i.position,
        itemId: i[itemIdKey],
        unitId: i.unit_id,
        customUnitId: i.each_unit_id
      };
    });

    //see if any of these are prep recipes
    //TODO: might make sense to go relational because of this... otherwise we have to fetch all preps every time, since we need to match against their inv_item_id
    db.getPrepRecipes().then(results => {
      inventory = inventory.map(i => {
        const prepRecipe = results.rows.find(
          row => row.doc && row.doc.inv_item_id === i.itemId
        );

        if (prepRecipe) {
          return Object.assign({}, i, { prepRecipeId: prepRecipe.doc.id });
        } else {
          return i;
        }
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
              const instructions = insJson.map(i => {
                return {
                  content: i.content,
                  id: i.id
                };
              });

              const recipe = {
                id,
                isMenuRecipe,
                inventory,
                instructions
              };

              db.upsertRecipe(recipe, callback);
            });
          } else {
            const recipe = {
              id,
              isMenuRecipe,
              inventory
            };

            db.upsertRecipe(recipe, callback);
          }
        });
    });
  });
};

module.exports = {
  populateMenuRecipes,
  populatePrepRecipes,
  populateRecipe
};
