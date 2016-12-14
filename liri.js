// At the top of the liri.js file, write the code you need to grab the data from keys.js. Then store the keys in a variable.
var fs = require('fs');
var inquirer = require('inquirer');
var twitterKeys = require('./keys.js');
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');

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

function spotifySearch() {
    spotify.search({
        type: 'track',
        query: 'The Sign Ace of Base'
    }, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }
        // console.log(JSON.stringify(data.tracks.items[0], null, 2));
        console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
        console.log("Song: " + data.tracks.items[0].name);
        console.log("URL: " + data.tracks.items[0].preview_url);
        console.log("Album: " + data.tracks.items[0].album.name);
    });
}

function omdbAPI() {}
var title = 'Mr Nobody';
var url = 'http://www.omdbapi.com/?tomatoes=true&t=' + title;
request(url, function (error, response, body) {
    var resp = JSON.parse(body);
    // console.log(resp);
    console.log('Title: ' + resp.Title);
    console.log('Year: ' + resp.Year);
    console.log('IMDB Rating:' + resp.imdbRating);
    console.log('Country: ' + resp.Country);
    console.log('Language: ' + resp.Language);
    console.log('Plot:' + resp.Plot);
    console.log('Actors: ' + resp.Actors);
    console.log('Title: ' + resp.Title);
    console.log('Rotten Tomatoes Rating: ' + resp.tomatoRating);
    console.log('Rotten Tomatoes URL: ' + resp.tomatoURL);
});
// Make it so liri.js can take in one of the following commands:
// * `my-tweets`

// * `spotify-this-song`

// * `movie-this`

// * `do-what-it-says`