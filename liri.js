// At the top of the liri.js file, write the code you need to grab the data from keys.js. Then store the keys in a variable.
var fs = require('fs');
var inquirer = require('inquirer');
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var twitterKeys = require('./keys.js');
// var randomText = require('./random.txt');
// var randomTextsplit = randomText.split(',');
// console.log(randomTextsplit);
var song = 'The Sign Ace of Base';
var movieTitle = 'Mr Nobody';
var url = 'http://www.omdbapi.com/?tomatoes=true&t=' + movieTitle;
var todo = process.argv[2];
var action;

var client = new Twitter({
    consumer_key: twitterKeys.twitterKeys.consumer_key,
    consumer_secret: twitterKeys.twitterKeys.consumer_secret,
    access_token_key: twitterKeys.twitterKeys.access_token_key,
    access_token_secret: twitterKeys.twitterKeys.access_token_secret
});
inquirer.prompt([{
    type: 'list',
    message: 'choose one',
    choices: ['my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says'],
    name: 'choice'
}]).then(function (resp) {
    action = resp.choice;
    // console.log(action);
    checkChoice();

});

function checkChoice() {
    if (action === 'my-tweets') {
        getTweets();
        // console.log('yes ' + action);
    } else if (action === 'spotify-this-song') {
        spotifySearch();
        // console.log('yes ' + action);
    } else if (action === 'movie-this') {
        omdbAPI();
        // console.log('yes ' + action);
    } else if (action === 'do-what-it-says') {
        randomText();
        // console.log('yes ' + action);
    }
}

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
        query: song
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

function omdbAPI() {
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
}

function randomText() {
    var random = fs.readFile('random.txt', 'utf8', function (err, data) {
        // console.log(data);
        var dataArray = data.split(',');
        action = dataArray[0];
        song = dataArray[1];
        // console.log(dataArray);
        checkChoice();
    });
}