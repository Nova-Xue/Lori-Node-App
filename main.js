//includ chalk
var chalk = require("chalk");
//include moment
var moment = require("moment");
//include axios to get api response
var axios = require("axios");
//include node-spotify-api
var Spotify = require("node-spotify-api");
//include inquirer for interaction
var inquirer = require("inquirer");
//include dotenv to save api keys locally
require("dotenv").config();
//get api key from key.js
var key = require("./key.js");
//write log every time there is a search
function writeLog(action, status) {
    var fs = require("fs");//include fs to append file
    fs.appendFile("log.txt", action + new Date() + status + " | ", function (err) {
        if (err) {
            console.log(err);
        }
    });
}
//fs to read command from the user input filename
function readCommand(fileName) {
    //read the file
    var fs = require("fs");
    if(fs.existsSync(fileName)){//file exists
        var cmd = fs.readFileSync(fileName).toString().split(",");
        if (cmd.length > 2) {//command with wrong format
            cmdObj =  "I can not do this";
            writeLog("Search " + fileName + " by file at ", "fail");
        } else {//correct command
            cmdObj = {
                fileKey: cmd[1],
                fileCatalog: cmd[0]
            }
        }
    }else{//file not found
        cmdObj = "I cannot find the file.";
        writeLog("Search " + fileName + " by file at ", "fail");
    }
    return cmdObj;
    
}
//axios to get response and format the display
function search(key, type, url) {
    //get response
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
function searchSpotify(keyWord, type) {
    var spotify = new Spotify(key.spotify);
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
//check type and form queryurl with keyword
//write log when the search is done
function checkCatalog(str1, str2) {
    console.log(chalk.blue.bold("Lori is searching for ") + chalk.green.bold(str1) + chalk.blue.bold("."));
    var query;
    switch (str2) {
        case "song"://search for song 
            searchSpotify(str1, str2)
            break;
        case "movie"://search for movie
            query = key.omdb.prefix + str1;
            search(str1, str2, query);
            break;
        case "band"://search for concerts
            query = key.bit.prefix + str1 + key.bit.id;
            search(str1, str2, query);
            break;
        case "file"://search for a file to get command
            //read file function
            if (str1.split(".")[1] == "txt") {//check suffix 
                console.log(chalk.blue.bold("Lori is reading the file."));
                var fileCommand = readCommand(str1);
                if(typeof fileCommand == "string"){
                    //string can be  "I can not do this " or "I cannot find the file"
                    console.log(chalk.red.bold(fileCommand));
                }else{//cmdObj correct cmd with type and key
                    checkCatalog(fileCommand.fileKey,fileCommand.fileCatalog);
                }
            }
            else {//not a file
                console.log(chalk.red.bold("Cannot read file " + str1));
                writeLog("Search " + str1 + " by " + str2 + " at ", "fail");
            }

            break;
        default://in case input went wrong //not necessary
            //save failure info to log
            console.log(chalk.red.bold("I cannot search for " + str2));
            console.log(chalk.red.bold("Please wait for further update"));
            writeLog("Search " + str1 + " by " + str2 + " at ", "fail");
            welcome();//go back to main function if input from last prompt goes wrong
    }
}
//main function 
function welcome() {
    console.log(chalk.blue.bold("What can I do for you?"));
    console.log(chalk.blue.bold("You can quit the bot at anytime by typing in \'quit\'."));
    inquirer.prompt({//ask for key
        tyep: "input",
        name: "search",
        message: chalk.blue.bold("Search for something or read command from a file:"),
        default: chalk.red.underline("A song, a movie, your favorite band or a file name")
    }).then((answer) => {
        if (answer.search != "quit") {
            let key = answer.search;
            if (key != chalk.red.underline("A song, a movie, your favorite band or a file name")) {
                inquirer.prompt({//ask for type//single choice
                    type: "list",
                    name: "catalog",
                    message: chalk.blue("Is ") + chalk.green(key) + chalk.blue(" a ") + chalk.yellow("song") + chalk.blue(", a ") + chalk.yellow("movie") + chalk.blue(", a ") + chalk.yellow("band") + chalk.blue(" or a ") + chalk.yellow("file") + chalk.blue("? "),
                    choices: [
                        "song","movie","band","file","quit"
                    ]
                }).then((answer) => {
                    if (answer.catalog != "quit") {//user input not to quit
                        checkCatalog(key, answer.catalog);
                        inquirer.prompt({//ask user to continue or not
                            type: "confirm",
                            name: "again",
                            message: chalk.blue.bold("Do you need to search anything else?"),
                            default: true
                        }).then((answer) => {
                            if (answer.again) {
                                welcome();//call main function to continue
                            } else {//quit
                                console.log(chalk.blue.bold("Thank you for using Lori the Bot!"));
                            }
                        });
                    } else {//quit
                        console.log(chalk.blue.bold("Thank you for using Lori the Bot!"));
                    }
                });
            } else {
                console.log(chalk.red.bold("Please enter something!"));
                welcome();
            }
        } else {//quit
            console.log(chalk.blue.bold("Thank you for using Lori the Bot!"));
        }
    });
}
//show once when enter the bot
console.log(chalk.blue.bold("Welome to Lori the Bot!"));
//call main function
welcome();