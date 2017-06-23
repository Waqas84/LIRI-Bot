var fs = require("fs");
var request = require("request");
var keys = require("./keys");
var inquirer = require('inquirer');
var Twit = require('twit');
var T = new Twit(keys.twitterKeys);
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotifyKeys)
var command = process.argv[2];

switch (command) {
    case "my-tweets":

        myTweet();

        break;

    case "spotify-this-song":

        spotifyThisSong();

        break;

    case "movie-this":

        movieThis();

        break;

    case "do-what-it-says":

        spotifyThisSong();

        break;
}

function myTweet() {
    inquirer.prompt([

        {
            type: "input",
            name: "userInput",
            message: "Compose new Tweet?"
        }

    ]).then(function(tweet) {

        T.post('statuses/update', {
            status: tweet.userInput
        }, function(err, data, response) {

            console.log(JSON.stringify(data, null, 2));

            T.get('statuses/user_timeline', {
                count: 20
            }, function(err, data, response) {

                for (var i = 0; i <= 20; i++) {

                    if (i === 20) {

                        console.log("You have checked my last Tweets");

                    } else {
                        
                        var myTweetResult = "\n-------------\n" + "Tweet " + (i + 1) + " " + JSON.stringify(data[i].text, null, 2) + "\n-------------\n";

                        console.log(myTweetResult);

                        fs.appendFile("log.txt", myTweetResult, function(err) {

                            if (err) {
                                console.log(err);
                            }

                        });
                    }
                }

            });
        });
    });

}

function spotifyThisSong() {


    if (process.argv[2] === "do-what-it-says") {

        fs.readFile("random.txt", "utf8", function(error, data) {

            if (error) {

                return console.log(error);

            } else {
                var dataArr = data.split(",");

                song = dataArr[1];

                spotifyPlayer();
            }


        });

    } else if (process.argv[3] === undefined) {

        song = 'The Sign';

        spotifyPlayer();

    } else {

        song = process.argv[3];

        spotifyPlayer();
    }


    function spotifyPlayer() {

        spotify.search({
            type: 'track',
            query: song
        }, function(err, data) {

            if (err) {

                return console.log('Error occurred: ' + err);

            } else {

                for (var i = 0; i < 20; i++) {

                    var songName = data.tracks.items[i].name;
                   
                    if (songName.indexOf(song)) {

                        var artist = data.tracks.items[i].album.artists[0].name;

                        var previewLink = data.tracks.items[0].preview_url;

                        var album = data.tracks.items[i].album.name;

                        var spotifyResult = "\n-------------\n" + "Artist(s): " + JSON.stringify(artist, null, 2) +
                            "\nSong Name: " + JSON.stringify(songName, null, 2) + "\npreview link: " + JSON.stringify(previewLink, null, 2) + "\nalbum: " + JSON.stringify(album, null, 2) + "\n-------------\n";

                        console.log(spotifyResult);

                        fs.appendFile("log.txt", spotifyResult, function(err) {

                            if (err) {
                                console.log(err);
                            }

                        });

                    }

                }
            }
        });
    }

};

function movieThis() {

    var movie = process.argv[3];

    if (movie === undefined) {

        var movie = 'Mr. Nobody';

        moviePlayer();

    } else {

        moviePlayer();
    }


    function moviePlayer() {

        var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece";

        request(queryUrl, function(error, response, body) {

            if (!error && response.statusCode === 200) {

                // var movieInfo = JSON.parse(body);

                var moviePlayerResult = "\n-------------\n" + "Title " + JSON.parse(body).Title + "\nRelease Year: " + JSON.parse(body).Year +
                    "\nIMDB Rating: " + JSON.parse(body).imdbRating + "\nCountry where the movie was produced: " + JSON.parse(body).Country + "\nLanguage: " +
                    JSON.parse(body).Language + "\nPlot: " + JSON.parse(body).Plot + "\nActors: " + JSON.parse(body).Actors + "\n-------------\n"

                console.log(moviePlayerResult);

                fs.appendFile("log.txt", moviePlayerResult, function(err) {

                    if (err) {
                        
                        console.log(err);
                    }

                });
            }
        });

    }
}