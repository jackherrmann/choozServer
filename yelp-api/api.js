const {API_BASE_URL, BEARER_TOKEN} = require('./config');
const queryString = require('query-string');
const fetch = require("node-fetch");

function get(path, queryParams) {
    console.log("IN GET");
    console.log(queryParams);
    const query = queryString.stringify(queryParams);

    return fetch(`${API_BASE_URL}${path}?${query}`, {
        headers : {
            Authorization : `Bearer ${BEARER_TOKEN}`,
            Origin : 'localhost',
            withCredentials : true,
        }
    });
}

module.exports = { get };