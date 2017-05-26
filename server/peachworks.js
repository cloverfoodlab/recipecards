const fetch = require('node-fetch');
const queryString = require('query-string');

// for every URL path that starts with /api/, send request to upstream API service
function peachworksAPIURL(query_obj, url) {
  let peachworks_account_id = process.env.PEACHWORKS_ACCOUNT_ID;
  let peachworks_access_token = process.env.PEACHWORKS_ACCESS_TOKEN;

  let result_query = Object.assign({}, query_obj, {
    access_token: peachworks_access_token
  });

  let result_qs = queryString.stringify(result_query);

  return (
    'https://api.peachworks.com/v1/accounts/' + peachworks_account_id +
    '/' + url + '?' + result_qs
  );
}

function fetchAndRespond(api_url, res) {
  // proof of concept, need to handle failed (non-json)
  // responses. want to strip out params
  // since that leaks the access_token,
  // but still want to show total item count
  // so we can have client-side pagination logic.
  fetch(api_url)
    .then(api_res => api_res.json())
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

function getPage(peach_json) {
  var page = 1;
  if (peach_json.params) {
    let pageString = peach_json.params['page'] || "1";
    page = parseInt(pageString, 10);
    if (isNaN(page)) {
      page = 1;
    }
  }
  return page;
}

function proxyGetRecipes(req, res) {
  let api_url = peachworksAPIURL(req.query, "wtm_recipes");
  fetchAndRespond(api_url, res);
}

/*
 * TODO:
 * this doesn't really give us any useful information, instead
 *
 * fetch inventory for id
 * /wtm_recipe_items?access_token=<token>&find={"recipe_id":<id>}
 * make an array of their item_id, fetch their item info
 * /wtm_inv_items?access_token=<token>&find={"id":{"$in":[<ids>]}}
 *
 * fetch instructions for id
 * /wtm_recipe_instructions?access_token=<token>&find={"recipe_id":<id>}
 */
function proxyGetRecipe(req, res) {
  let api_url = peachworksAPIURL(req.query, "wtm_recipes/" + req.params.id);
  fetchAndRespond(api_url, res);
}

module.exports.proxyGetRecipes = proxyGetRecipes;
module.exports.proxyGetRecipe = proxyGetRecipe;
