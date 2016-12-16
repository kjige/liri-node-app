var fs = require('fs');
var inquirer = require('inquirer');
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var twitterKeys = require('./keys.js');

// default song if none entered
var song = 'The Sign Ace of Base';

// default movie if none entered
var movieTitle = 'Mr Nobody';
var url = 'http://www.omdbapi.com/?tomatoes=true&t=' + movieTitle;
var query;
var action;
var randomCheck = false;
var queryLog;
var log;

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
        if (randomCheck) {
            song = query;
            // console.log(song);
            randomCheck = false;
            spotifySearch();
        } else {
            whatSong();
        }
        // console.log('yes ' + action);
    } else if (action === 'movie-this') {
        if (randomCheck) {
            movieTitle = query;
            // console.log(movieTitle);
            url = 'http://www.omdbapi.com/?tomatoes=true&t=' + movieTitle;
            randomCheck = false;
            omdbAPI();
        } else {
            whatMovie();
        }
        // console.log('yes ' + action);
    } else if (action === 'do-what-it-says') {
        randomText();
        // console.log('yes ' + action);
    }
}

function whatSong() {
    inquirer.prompt([{
        type: 'input',
        message: 'What is the song title and name of artist?',
        name: 'songTitle'
    }]).then(function (resp) {
        if (resp.songTitle.length > 0) {
            song = resp.songTitle;
            queryLog = resp.songTitle;
        } else {
            queryLog = song;
        }
        spotifySearch();
    });
}

// ask user for movie title
function whatMovie() {
    inquirer.prompt([{
        type: 'input',
        message: 'What is the movie title?',
        name: 'movieTitle'
    }]).then(function (resp) {

        // check that user did not enter empty query
        if (resp.movieTitle.length > 0) {

            // store user query for logging to log.txt
            queryLog = resp.movieTitle;

            // store movie title
            movieTitle = resp.movieTitle;

            // make url with user input title
            url = 'http://www.omdbapi.com/?tomatoes=true&t=' + movieTitle;
        } else {
            // if user input is empty, use default movie title
            queryLog = movieTitle;
        }
        omdbAPI();
    });
}

// API call to Twitter
function getTweets() {
    client.get('statuses/user_timeline', {
        count: '20'
    }, function (error, tweets, response) {
        var summary;

        // return error message if error occurs
        if (error) {
            console.log('Error occurred: ' + error);
            return;
        } else {

            // store last 20 tweets to summary
            for (var i = 0; i < tweets.length; i++) {
                summary += '\n\t' + tweets[i].text;
            }
        }

        // display summary
        console.log(summary);

        // call this function with summarized data
        logActivity(summary);
    });
}

// API call to Spotify
function spotifySearch() {
    spotify.search({
        type: 'track',
        query: song
    }, function (error, data) {

        // return error message if error occurs
        if (error) {
            console.log('Error occurred: ' + error);
            return;
        } else {

            // select and store specific data from object
            var a = "Artist: " + data.tracks.items[0].album.artists[0].name;
            var s = "Song: " + data.tracks.items[0].name;
            var u = "URL: " + data.tracks.items[0].preview_url;
            var al = "Album: " + data.tracks.items[0].album.name;

            // concatenate stored data and display in terminal
            var summary = '\t' + a + '\n\t' + s + '\n\t' + u + '\n\t' + al;
            console.log(summary);

            // call this function with summarized data
            logActivity(summary);
        }
    });
}

// API call for OMDB 
function omdbAPI() {
    request(url, function (error, response, body) {

        // return error message if error occurs
        if (error) {
            console.log('Error occurred: ' + error);
            return;
        } else {

            // convert response to JSON object
            var resp = JSON.parse(body);

            // select and store specific data from object
            var t = 'Title: ' + resp.Title;
            var y = 'Year: ' + resp.Year;
            var i = 'IMDB Rating:' + resp.imdbRating;
            var c = 'Country: ' + resp.Country;
            var l = 'Language: ' + resp.Language;
            var p = 'Plot:' + resp.Plot;
            var a = 'Actors: ' + resp.Actors;
            var r = 'Rotten Tomatoes Rating: ' + resp.tomatoRating;
            var ru = 'Rotten Tomatoes URL: ' + resp.tomatoURL;

            // concatenate stored data and display in terminal
            var summary = '\t' + t + '\n\t' + y + '\n\t' + i + '\n\t' + c + '\n\t' + l + '\n\t' + p + '\n\t' + a + '\n\t' + r + '\n\t' + ru;
            console.log(summary);

            // call this function with summarized data
            logActivity(summary);
        }
    });
}

function randomText() {
    var random = fs.readFile('random.txt', 'utf8', function (err, data) {
        var dataArray = data.split(',');
        action = dataArray[0];
        query = dataArray[1];
        randomCheck = true;
        checkChoice();
    });
}

// log activity in log.txt
function logActivity(summary) {
    log = '\n\nAction chosen: ' + action + ', query: ' + queryLog + '\n' + summary;
    fs.appendFile('log.txt', log, function () {});
}