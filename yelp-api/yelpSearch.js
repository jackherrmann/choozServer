
const api = require('./api');

async function yelpSearch(term, latitude, longitude, params) {


    var searchParams = {
        'term' : term, 
        'latitude' : latitude, 
        'longitude' : longitude,
    };

    if (!(params.price == 'Any')) {
        searchParams['price'] = params.price.length;
    }

    if (!(params.cuisine == 'Any')) {
        searchParams['categories'] = (params.cuisine).toLowerCase().replace(' ', '_');
    }

    console.log(searchParams)
    try {
        const rawData = await api.get('/businesses/search', searchParams);
        const resp = await rawData.json();
        return resp.businesses;
        
    } catch(e) {
        console.error(e);
    }
}

module.exports = { yelpSearch };