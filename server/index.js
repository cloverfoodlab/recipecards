const express = require('express');
const app = express();

const fetch = require('node-fetch');
const queryString = require('query-string');

// for every URL path that starts with /api/, send request to upstream API service
var peachworksAPIURL = function(query_obj) {
    var peachworks_account_id = process.env.PEACHWORKS_ACCOUNT_ID;
    var peachworks_access_token = process.env.PEACHWORKS_ACCESS_TOKEN;

    let result_query = Object.assign({}, query_obj, {
        access_token: peachworks_access_token
    });

    let result_qs = queryString.stringify(result_query);

    return (
        'https://api.peachworks.com/v1/accounts/' + peachworks_account_id +
        '/wtm_recipes?' + result_qs
    );
};


app.get('/api/wtm_recipes', function (req, res) {
    let api_url = peachworksAPIURL(req.query);
    console.log(api_url);

    // proof of concept, need to handle failed (non-json)
    // responses. want to strip out params
    // since that leaks the access_token,
    // but still want to show total item count
    // so we can have client-side pagination logic.
    fetch(api_url)
        .then(api_res => api_res.json())
        .then(json => res.json(json.results));
});

app.use(express.static('dist'));
app.listen(3000);