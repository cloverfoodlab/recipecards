const PouchDb = require("pouchdb");
PouchDb.plugin(require("pouchdb-adapter-memory"));
PouchDb.plugin(require("pouchdb-upsert"));
PouchDb.plugin(require("relational-pouch"));

/*
 * METHODS TO ACCESS THE DB
 */

let db = new PouchDb("peachworks", { adapter: "memory" });

const dbId = (isMenuRecipe, id) => {
  return isMenuRecipe ? "recipe-menu-" + id : "recipe-prep-" + id;
};

const getAllRecipes = () => {
  return db.allDocs({
    startkey: "recipe-",
    endkey: "recipe-\uffff",
    include_docs: true
  });
};

const getPrepRecipes = () => {
  return db.allDocs({
    startkey: "recipe-prep-",
    endkey: "recipe-prep-\uffff",
    include_docs: true
  });
};

const getMenuRecipes = () => {
  return db.allDocs({
    startkey: "recipe-menu-",
    endkey: "recipe-menu-\uffff",
    include_docs: true
  });
};

const getRecipe = (isMenuRecipe, id) => {
  const _id = dbId(isMenuRecipe, id);

  return db.get(_id);
};

const bulkUpdate = recipes => {
  return db.bulkDocs(recipes);
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

const upsertRecipe = (recipe, callback) => {
  const _id = dbId(recipe.isMenuRecipe, recipe.id);
  const dbRecipe = Object.assign({}, recipe, { _id: _id });

  createOrUpdate(dbRecipe, callback);
};

module.exports = {
  getAllRecipes,
  getPrepRecipes,
  getMenuRecipes,
  getRecipe,
  upsertRecipe,
  bulkUpdate
};
