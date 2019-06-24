//includ chalk
var chalk = require("chalk");
//include moment
var moment = require("moment");
//include axios to get api response
var axios = require("axios");
//include node-spotify-api
var Spotify = require("node-spotify-api");
//get api key from key.js
require("dotenv").config();
var key = require("./key.js");
//include writelog
var writeLog = require("./log.js").writeLog;
//axios to get response and format the display
exports.search = function (key, type, url) {
    //get response
    var checkCatalog = require("./query.js").checkCatalog;
    axios.get(url).then((resp) => {
        //console.log(resp);
        //display response here
        //check type to format json 
        //console.log(resp);
        if (type == "movie") {
            //movie format
            //     * Title of the movie.
            //    * Year the movie came out.
            //    * IMDB Rating of the movie.
            //    * Rotten Tomatoes Rating of the movie.
            //    * Country where the movie was produced.
            //    * Language of the movie.
            //    * Plot of the movie.
            //    * Actors in the movie.
            if (resp.data.Response == "True") {
                console.log(chalk.blue.bold("I found : "));
                console.log(chalk.inverse("Title : " + resp.data.Title));
                console.log(chalk.inverse("Released year : " + resp.data.Year));
                console.log(chalk.inverse("IMDB rating : " + resp.data.imdbRating));
                console.log(chalk.inverse(resp.data.Ratings[1].Source + " : " + resp.data.Ratings[1].Value));
                console.log(chalk.inverse("Country : " + resp.data.Country));
                console.log(chalk.inverse("Language : " + resp.data.Language));
                console.log(chalk.inverse("Plot : " + resp.data.Plot));
                console.log(chalk.inverse("Actors : " + resp.data.Actors));
                console.log(chalk.inverse("-------------------------------------------"));
                writeLog("Search " + key + " by " + type + " at ", "success");
            } else {//search default
                console.log(chalk.red.bold("Movie not found!"));
                writeLog("Search " + key + " by " + type + " at ", "fail");
                console.log(chalk.blue.bold("I found you somthing instead : "));
                //search default
                checkCatalog("Mr. Nobody.","movie");
            }
        } else if (type == "band") {
            //concert format
            // Name of the venue
            // Venue location
            // Date of the Event (use moment to format this as "MM/DD/YYYY")
            var data = resp.data;
            if (data != "\n{warn=Not found}\n") {//band found
                if (data.length > 0) {
                    console.log(chalk.inverse("Upcoming events of your band : "));
                    for (var i = 0; i < data.length; i++) {
                        //name
                        console.log(chalk.inverse("Venue : " + data[i].venue.name));
                        //location
                        console.log(chalk.inverse("Venue location : " + data[i].venue.city + " " + data[i].venue.region + " " + data[i].venue.country));
                        //date
                        //moment    2019-06-28T19:00:52
                        //console.log(data[i].datetime.split("T"));
                        console.log(chalk.inverse("Date : " + data[i].datetime.split("T")[1] + " on " + moment(data[i].datetime.split("T")[0]).format("MM/DD/YYYY")));
                        console.log(chalk.inverse("-------------------------------------------"));
                    }
                    writeLog("Search " + key + " by " + type + " at ", "success");
                } else {//no events
                    console.log(chalk.inverse("No upcomging event!"));
                    writeLog("Search " + key + " by " + type + " at ", "success");
                }
            } else {//band not found
                console.log(chalk.red.bold("Can not find your band!"));
                writeLog("Search " + key + " by " + type + " at ", "fail");
            }
        } else {//
            console.log("wrong type");
            writeLog("Search " + key + " by " + type + " at ", "fail");
        }
    });
}

//spotify api and format display
exports.searchSpotify = function (keyWord, type) {
    var spotify = new Spotify(key.spotify);
    var checkCatalog = require("./query.js").checkCatalog;
    spotify.search({//search for a track
        type: "track",
        query: keyWord
    }, function (err, data) {
        if (err) {
            return console.log(err + "from spotify api");
        }
        //display data here
        // Artist(s)
        // The song's name
        // A preview link of the song from Spotify
        // The album that the song is from
        // If no song is provided then your program will default to "The Sign" by Ace of Base.
        var tracks = data.tracks.items;
        if (tracks.length > 0) {//found song
            console.log(chalk.blue.bold("I found : "));
            for (var i = 0; i < tracks.length; i++) {
                //artists
                console.log(chalk.inverse("Artist(s) : "));
                let artists = tracks[i].artists;
                for (var j = 0; j < artists.length; j++) {
                    console.log(chalk.inverse(artists[j].name));
                }
                //name
                console.log(chalk.inverse("Song : " + tracks[i].name));
                //preview
                console.log(chalk.inverse("Preview link : " + tracks[i].preview_url));
                //album
                console.log(chalk.inverse("Album : " + tracks[i].album.name));
                console.log(chalk.inverse("-------------------------------------------"));
            }
            writeLog("Search " + keyWord + " by " + type + " at ", "success");
        } else {//song not found
            console.log(chalk.red.bold("Can not find any song named " + keyWord + " for you."));
            writeLog("Search " + keyWord + " by " + type + " at ", "fail");
            //search default
            console.log(chalk.red.bold("I found something instead."));
            checkCatalog("The Sign", "song");
        }
    });
}