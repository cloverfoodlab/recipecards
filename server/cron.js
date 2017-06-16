const schedule = require("node-schedule");
const fetcher = require("./fetcher");
const db = require("./db");

//TODO: expose API to force fetch?

const fetchRecipesList = callback => {
  fetcher.populateMenuRecipes(() => {
    fetcher.populatePrepRecipes(() => {
      console.log("successfully fetched recipes list");
      callback();
    });
  });
};

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const fetchRecipeDetails = (dbCall, isMenuRecipe) => {
  const prefix = isMenuRecipe ? "menu-" : "prep-";

  dbCall().then(result => {
    result.rows.forEach(row => {
      //to prevent API from overloading lul
      sleep(1000).then(() => {
        const { id } = row.doc;
        fetcher.populateRecipe(id, isMenuRecipe, () => {
          console.log("successfully fetched recipe " + prefix + id);
        });
      });
    });
  });
};

const fetchMenuRecipes = () => {
  fetchRecipeDetails(db.getMenuRecipes, true);
};

const fetchPrepRecipes = () => {
  fetchRecipeDetails(db.getPrepRecipes, false);
};

const scheduleJobs = () => {
  console.log("scheduling jobs");

  //run job every hour at :10 - fetch menu recipes
  schedule.scheduleJob("10 * * * *", () => {
    console.log("fetching menu recipes");

    fetchRecipesList(() => {
      fetchMenuRecipes();
    });
  });

  //run job every hour at :40 - fetch prep recipes. spread out from menu to prevent overwhelming API
  schedule.scheduleJob("40 * * * *", () => {
    console.log("fetching prep recipes");

    fetchRecipesList(() => {
      fetchPrepRecipes();
    });
  });
};

module.exports = {
  scheduleJobs
};
