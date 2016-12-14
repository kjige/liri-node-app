// At the top of the liri.js file, write the code you need to grab the data from keys.js. Then store the keys in a variable.
var fs = require('fs');
var inquirer = require('inquirer');
var twitterKeys = require('./keys.js');
var Twitter = require('twitter');

var client = new Twitter({
    consumer_key: twitterKeys.twitterKeys.consumer_key,
    consumer_secret: twitterKeys.twitterKeys.consumer_secret,
    access_token_key: twitterKeys.twitterKeys.access_token_key,
    access_token_secret: twitterKeys.twitterKeys.access_token_secret
});

function getTweets() {
    client.get('statuses/user_timeline', {
        count: '20'
    }, function (error, tweets, response) {
        if (error) throw error;
        for (var i = 0; i < tweets.length; i++) {
            console.log(tweets[i].text);
        }
    });
}


// Make it so liri.js can take in one of the following commands:
// * `my-tweets`

// * `spotify-this-song`

// * `movie-this`

// * `do-what-it-says`