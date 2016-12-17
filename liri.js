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

// ask user to pick a choice
inquirer.prompt([{
    type: 'list',
    message: 'choose one',
    choices: ['my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says'],
    name: 'choice'
}]).then(function (resp) {

    // store user's choice
    action = resp.choice;
    checkChoice();

});

// check what choice did user make
function checkChoice() {

    // check if user chose 'my-tweets'
    if (action === 'my-tweets') {
        getTweets();

        // check if user chose 'spotify-this-song'
    } else if (action === 'spotify-this-song') {

        // check if user chose 'do-what-it-says'
        if (randomCheck) {

            // assign song title from random.txt
            song = query;

            // change flag back to false
            randomCheck = false;
            spotifySearch();
        } else {

            // if user did not pick 'do-what-it-says'
            whatSong();
        }
        // run getTweets function if user chose 'my-tweets'
    } else if (action === 'movie-this') {

        // check if user chose 'do-what-it-says'
        if (randomCheck) {

            // assign movie title from random.txt
            movieTitle = query;

            // make url for API call
            url = 'http://www.omdbapi.com/?tomatoes=true&t=' + movieTitle;

            // change flag back to false
            randomCheck = false;
            omdbAPI();
        } else {

            // if user did not pick 'do-what-it-says'
            whatMovie();
        }

        // check if user chose 'do-what-it-says'
    } else if (action === 'do-what-it-says') {
        randomText();
    }
}

// ask user for song title
function whatSong() {
    inquirer.prompt([{
        type: 'input',
        message: 'What is the song title and name of artist?',
        name: 'songTitle'
    }]).then(function (resp) {

        // check that user did not enter empty query
        if (resp.songTitle.length > 0) {

            // store song title
            song = resp.songTitle;

            // store user query for logging to log.txt
            queryLog = resp.songTitle;
        } else {

            // if user input is empty, use default movie title
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

        // var to store tweets
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

        // store this statement describing the search parameter to log in log.txt
        queryLog = 'last 20 tweets';

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

// process random.txt and run its commands
function randomText() {

    // read random.txt
    fs.readFile('random.txt', 'utf8', function (err, data) {

        // split the statement using the comma to get command and query
        var dataArray = data.split(',');

        // store command and query
        action = dataArray[0];
        query = dataArray[1];
        queryLog = dataArray[1];

        // flag indicating user chose 'do-what-it-says'
        randomCheck = true;
        checkChoice();
    });
}

// log activity in log.txt
function logActivity(summary) {

    // concatenate data into var
    log = '\n\nAction chosen: ' + action + ', query: ' + queryLog + '\n' + summary;

    // append log data to log.txt
    fs.appendFile('log.txt', log, function () {});
}