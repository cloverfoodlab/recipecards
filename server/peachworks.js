const fetch = require('node-fetch');
const queryString = require('query-string');

// for every URL path that starts with /api/, send request to upstream API service
const peachworksApiUrl = (queryObj, url, otherQueries = {}) => {
  const peachworksAccountId = process.env.PEACHWORKS_ACCOUNT_ID;
  const peachworksAccessToken = process.env.PEACHWORKS_ACCESS_TOKEN;

  let resultQuery = Object.assign({}, queryObj, {
    "access_token": peachworksAccessToken
  });

  for (key in otherQueries) {
    if (hasOwnProperty.call(otherQueries, key)) {
      resultQuery[key] = otherQueries[key]
    }
  }

  const resultQs = queryString.stringify(resultQuery);

  return (
    'https://api.peachworks.com/v1/accounts/' + peachworksAccountId +
    '/' + url + '?' + resultQs
  );
}

const fetchAndRespond = (apiUrl, res) => {
  // proof of concept, need to handle failed (non-json)
  // responses. want to strip out params
  // since that leaks the access_token,
  // but still want to show total item count
  // so we can have client-side pagination logic.
  fetch(apiUrl)
    .then(apiRes => apiRes.json())
    .then(json => {
      if (json.error) {
        res.json(json);
      } else {
        res.json({
          json: json,
          page: getPage(json)
        });
      }
    });
}

const getPage = (peachJson) => {
  let page = 1;
  if (peachJson.params) {
    const pageString = peachJson.params['page'] || "1";
    page = parseInt(pageString, 10);
    if (isNaN(page)) {
      page = 1;
    }
  }
  return page;
}

const proxyGetRecipes = (req, res) => {
  const apiUrl = peachworksApiUrl(req.query, "wtm_recipes");
  fetchAndRespond(apiUrl, res);
}

/*
 * TODO:
 * make an array of inventory item_id, fetch their item info
 * /wtm_inv_items?access_token=<token>&find={"id":{"$in":[<ids>]}}
 */

// fetch inventory for id
// /wtm_recipe_items?access_token=<token>&find={"recipe_id":<id>}
const proxyGetInventory = (req, res) => {
  const otherQueries = {find: '{"recipe_id":' + req.params.id + '}'}
  const apiUrl = peachworksApiUrl(req.query, "wtm_recipe_items", otherQueries);
  fetchAndRespond(apiUrl, res);
}

// fetch instructions for id
// /wtm_recipe_instructions?access_token=<token>&find={"recipe_id":<id>}
const proxyGetInstructions = (req, res) => {
  const otherQueries = {find: '{"recipe_id":' + req.params.id + '}'}
  const apiUrl = peachworksApiUrl(req.query, "wtm_recipe_instructions", otherQueries);
  fetchAndRespond(apiUrl, res);
}

module.exports = {
  proxyGetRecipes: proxyGetRecipes,
  proxyGetInventory: proxyGetInventory,
  proxyGetInstructions: proxyGetInstructions
}
