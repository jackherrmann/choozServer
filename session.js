const {yelpSearch} = require('../yelp-api/yelpSearch');

class Session {

    constructor(category, numActivities, location, params) {
        this.host = "";
        this.choosers = [];
        this.category = category;
        this.swipes = {};
        this.numActivities = numActivities;
        this.results = {}; // maps activites to num of matches, take that number compare to total num of users
        this.activities = [];
        this.location = location;
        this.params = params;
    }

    getMembers() {
        return this.choosers;
    }

    getActivities() {
        return this.activities;
    }

    addMember(name) {
        this.choosers.push(name);
    }

    setHost(name) {
        this.hose = name;
    }

    processSwipes(name, userSwipes) {
        this.swipes[name] = userSwipes;
    }

    isFinished() {
        if (Object.keys(this.swipes).length == this.choosers.length) {
            return true;
        }

        return false;
    }

    // TODO: Fix
    getMatches() {
        var indexes = {};
        var currIndex = 0;

        for (var i of Object.keys(this.swipes)) {
            for (var j of this.swipes[i]) {
                currIndex in indexes 
                    ? indexes[currIndex] += j
                    : indexes[currIndex] = j;
                currIndex++;
            }
            currIndex = 0;
        }

        var matches = [];

        for (var i of Object.keys(indexes)) {
            if (indexes[i] == this.choosers.length) {
                matches.push(this.activities[i]);
            }
        }

        return matches;
    }
}

module.exports = { Session };