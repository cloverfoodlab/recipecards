const fetch = require("node-fetch");
const queryString = require("query-string");

// for every URL path that starts with /api/, send request to upstream API service
const peachworksApiUrl = (url, otherQueries = {}, page = 1, limit = 1000) => {
  const peachworksAccountId = process.env.PEACHWORKS_ACCOUNT_ID;
  const peachworksAccessToken = process.env.PEACHWORKS_ACCESS_TOKEN;

  let resultQuery = Object.assign({}, otherQueries, {
    access_token: peachworksAccessToken,
    limit: limit,
    page: page
  });

  const resultQs = queryString.stringify(resultQuery);

  return (
    "https://api.peachworks.com/v1/accounts/" +
    peachworksAccountId +
    "/" +
    url +
    "?" +
    resultQs
  );
};

const stripAccessToken = peachJson => {
  // this feels really nasty coming from immutable object land...
  // there is probably a more idiomatic way to do this
  const peachJsonCopy = Object.assign({}, peachJson);
  if (
    peachJsonCopy.hasOwnProperty("params") &&
    peachJsonCopy.params.hasOwnProperty("access_token")
  ) {
    delete peachJsonCopy.params.access_token;
  }
  return peachJsonCopy;
};

const fetchAndRespond = apiUrl => {
  // proof of concept, may need to handle failed (non-json) responses.
  // access_token is stripped out of the params property if present to avoid leaking to client.
  // we also introduce an explicit page property for simpler client-side pagination logic.
  return new Promise((resolve, reject) => {
    fetch(apiUrl).then(apiRes => apiRes.json()).then(json => {
      if (json.error) {
        reject(json);
      } else {
        const cleanedJson = stripAccessToken(json);
        resolve(cleanedJson.results);
      }
    });
  });
};

const proxyGetMenuRecipes = (page = 1) => {
  const apiUrl = peachworksApiUrl("wtm_recipes", {}, page);
  return fetchAndRespond(apiUrl);
};

const proxyGetPrepRecipes = (page = 1) => {
  const apiUrl = peachworksApiUrl("wtm_inv_prep_recipes", {}, page);
  return fetchAndRespond(apiUrl);
};

// fetch inventory for id
// /wtm_recipe_items?access_token=<token>&find={"recipe_id":<id>}
const proxyGetInventory = id => {
  const otherQueries = { find: '{"recipe_id":' + id + "}" };
  const apiUrl = peachworksApiUrl("wtm_recipe_items", otherQueries);
  return fetchAndRespond(apiUrl);
};

//wtm_inv_prep_recipe_items?access_token=<token>~&find={"inv_item_id":<id>}
const proxyGetPrepInventory = id => {
  const otherQueries = { find: '{"inv_item_id":' + id + "}" };
  const apiUrl = peachworksApiUrl("wtm_inv_prep_recipe_items", otherQueries);
  return fetchAndRespond(apiUrl);
};

// fetch instructions for id
// /wtm_recipe_instructions?access_token=<token>&find={"recipe_id":<id>}
const proxyGetInstructions = id => {
  const otherQueries = { find: '{"recipe_id":' + id + "}" };
  const apiUrl = peachworksApiUrl("wtm_recipe_instructions", otherQueries);
  return fetchAndRespond(apiUrl);
};

// fetch item info for inventory item_ids
// /wtm_inv_items?access_token=<token>&find={"id":{"$in":[<ids>]}}
const proxyGetItems = ids => {
  const otherQueries = { find: '{"id":{"$in":[' + ids.join() + "]}}" };
  const apiUrl = peachworksApiUrl("wtm_inv_items", otherQueries);
  return fetchAndRespond(apiUrl);
};

// fetch units of measures data
// /wtm_units?access_token=<token>&find={"id":{"$in":[<ids>]}}
const proxyGetUnits = ids => {
  const otherQueries = { find: '{"id":{"$in":[' + ids.join() + "]}}" };
  const apiUrl = peachworksApiUrl("wtm_units", otherQueries);
  return fetchAndRespond(apiUrl);
};

// fetch custom units
// wtm_inv_item_units?access_token=<token>&find={"id":{"$in":[<ids>]}}

const proxyGetCustomUnits = ids => {
  const otherQueries = { find: '{"id":{"$in":[' + ids.join() + "]}}" };
  const apiUrl = peachworksApiUrl("wtm_inv_item_units", otherQueries);
  return fetchAndRespond(apiUrl);
};

module.exports = {
  proxyGetMenuRecipes: proxyGetMenuRecipes,
  proxyGetPrepRecipes: proxyGetPrepRecipes,
  proxyGetInventory: proxyGetInventory,
  proxyGetPrepInventory: proxyGetPrepInventory,
  proxyGetInstructions: proxyGetInstructions,
  proxyGetItems: proxyGetItems,
  proxyGetUnits: proxyGetUnits,
  proxyGetCustomUnits: proxyGetCustomUnits
};
