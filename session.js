// import {yelpSearch} from '../yelp-api/yelpSearch';

class Session {

    constructor(category, numActivities, location) {
        this.host = "";
        this.choosers = {};
        this.category = category;
        this.swipes = {};
        this.numActivities = numActivities;
        this.results = {}; // maps activites to num of matches, take that number compare to total num of users
        this.activities = [];
        this.location = location
        this.generateActivities(this.category);
    }

    getCategory() {
        return this.category;
    }

    getNumActivites() {
        return this.numActivities;
    }

    getNumMembers() {
        return Object.keys(this.choosers).length;
    }

    generateActivities(category) {
        if (category == "movies") {

        } else if (category == "working...") {
            const [businesses, amountResults, searchParams, setSearchParams] 
                = yelpSearch(category, location.latitude, location.longitude);

            var c = 0;
            
            for (b in businesses) { 
                if (c == this.numActivities) {
                    break;
                }

                const activity = {
                    name : b.name,
                    cuisine : b.categories[0].title,
                    url : b.url,
                    image_url : b.image_url,
                    rating : b.rating,
                    price : b.price,
                    location : b.location.display_address,
                }

                this.activities.push(activity);
                c++;
            }

            for (name in this.choosers) {
                var dummy = [];
                for (var i = 0; i < c + 1; i++) {
                    dummy.push(-1);
                }
    
                this.swipes[name] = dummy;
            }
            
            // name, price, cuisine, type = food, rating, 
        } else if (category == "events") {

        }

        //implement apis
        return -1; 
    }

    addMember(name) {
        this.choosers[name] = 0;
    }

    setHost(name) {
        this.hose = name;
    }

    performSwipe(name, direction) {
        var idx = this.choosers[name]

        if (direction == "left") {
            this.swipes[name][idx] = 0;
        } else {
            this.swipes[name][idx] = 1;
        }

        this.choosers[name]++;
    }

    isFinished() {
        for (i in choosers) {
            if (choosers[i] !== self.nums) {
                return false;
            }
        }

        return true;
    }

    getMatches() {
        indexes = {};
        currIndex = 0;

        for (i in swipes) {
            for (j of swipes[i]) {
                indexes[currIndex] += j;
                currIndex++;
            }
            currIndex = 0;
        }

        matches = [];

        for (i in indexes) {
            if (index[i] == this.choosers.length()) {
                matches.push(activities[i]);
            }
        }

        return matches;
    }
}

module.exports = { Session };