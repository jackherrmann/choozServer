
const api = require('./api');

async function yelpSearch(term, latitude, longitude, params) {
    var businesses = [];

    var searchParams = {
        'term' : term, 
        'latitude' : latitude, 
        'longitude' : longitude,
    };

    if (!(params.price == 'Any')) {
        searchParams['price'] = params.price;
    }

    if (!(params.cuisine == 'Any')) {
        searchParams['categories'] = (params.cuisine).toLowerCase().replace(' ', '_');
    }

    console.log(searchParams)
    try {
        const rawData = await api.get('/businesses/search', searchParams);
        const resp = await rawData.json();
        // console.log(resp.businesses[0])
        console.log("FIRST")
        return resp.businesses;
        
    } catch(e) {
        console.error(e);
    }
}

module.exports = { yelpSearch };