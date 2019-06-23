//includ chalk
var chalk = require("chalk");
//include moment
var moment = require("moment");
//include file stream
//var fs = require("fs");
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
//search with queryurl and display by type
function writeLog(action, status) {
    var fs = require("fs");//include fs to append file
    fs.appendFile("log.txt", action + new Date() + status + " | ", function (err) {
        if (err) {
            console.log(err);
        }
    });
}
function readCommand(fileName) {
    //read the file
    var fs = require("fs");
    var cmd = fs.readFileSync(fileName).toString().split(",");
    //return the catalog and key word from txt file 
    if(cmd.length>2){
        return "Can not do this"
    }else{
        return {
            fileKey: cmd[1],
            fileCatalog: cmd[0]
        }
    }
}
function search(type, url) {
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
            } else {
                console.log(chalk.red.bold("Movie not found!"));
                console.log(chalk.blue.bold("I found you somthing instead : "));
                //defautlt search
                search("movie", key.omdb.prefix + "Mr. Nobody");
            }
        } else if (type == "band") {
            //concert format
            // Name of the venue
            // Venue location
            // Date of the Event (use moment to format this as "MM/DD/YYYY")
            var data = resp.data;
            if (data != "\n{warn=Not found}\n") {
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
                    }
                } else {
                    //no events
                    console.log(chalk.inverse("No upcomging event!"));
                }
            } else {
                console.log(chalk.red.bold("Can not find your band!"));
            }
        } else {
            return console.log("wrong type");
        }
    });
}
function searchSpotify(keyWord) {
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
        if (tracks.length > 0) {
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
            }
        } else {
            console.log(chalk.red.bold("Can not find any song named " + keyWord + " for you."));
            console.log(chalk.blue.bold("I found 'The Sign' for you."));
            searchSpotify("The Sign");
        }
    });
}
//check type and form queryurl with keyword
//write log when the search is done
function checkCatalog(str1, str2) {
    if (str2 != "quit") {//quit when user inputs 'quit'
        console.log(chalk.blue.bold("Lori is searching for ") + chalk.green.bold(str1) + chalk.blue.bold("."));
        var query;
        switch (str2) {
            case "song":
                if (searchSpotify(str1)) {
                    writeLog("Search " + str1 + " by " + str2 + " at ", "success");
                } else {
                    writeLog("Search " + str1 + " by " + str2 + " at ", "fail");
                }
                break;
            case "movie":
                query = key.omdb.prefix + str1;
                if (search(str2, query)) {
                    writeLog("Search " + str1 + " by " + str2 + " at ", "success");
                } else {
                    writeLog("Search " + str1 + " by " + str2 + " at ", "fail");
                }
                break;
            case "band":
                query = key.bit.prefix + str1 + key.bit.id;
                if (search(str2, query)) {
                    writeLog("Search " + str1 + " by " + str2 + " at ", "success");
                } else {
                    writeLog("Search " + str1 + " by " + str2 + " at ", "fail");
                }
                break;
            case "file":
                //read file function
                if (str2.split(".")[1] == "txt") {//check suffix 
                    console.log(chalk.blue.bold("Lori is reading the file."));
                    var fileCommand = readCommand(str1);
                    //checkCatalog(fileCommand.fileKey,fileCommand.fileCatalog);
                    if(fileCommand != "Can not do this"){
                        checkCatalog(fileCommand.fileKey, fileCommand.fileCatalog);
                        writeLog("Search " + str1 + " by " + sr2 + " at ", "success");
                    }else{
                        writeLog("Search " + str1 + " by " + str2 + " at ", "fail");
                    }
                } else {
                    console.log(chalk.red.bold("Cannot read file " + str1));
                }
                break;
            default://in case in put from expand went wrong //not necessary
                //save failure info to log
                console.log(chalk.red.bold("I cannot search for " + str2));
                console.log(chalk.red.bold("Please wait for further update"));
                writeLog("Search " + str1 + " by " + str2 + " at ", "fail");
                welcome();//go back to main function if input from last prompt goes wrong
        }
    } else {
        console.log(chalk.blue.bold("Thank you for using Lori the Bot!"));
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
                    type: "expand",
                    name: "catalog",
                    message: chalk.blue("Is ") + chalk.green(key) + chalk.blue(" a ") + chalk.yellow("song") + chalk.blue(", a ") + chalk.yellow("movie") + chalk.blue(", a ") + chalk.yellow("band") + chalk.blue(" or a ") + chalk.yellow("file") + chalk.blue("? ") + chalk.red.bold("(You can type q to quit,type h or enter for help)"),
                    choices: [
                        {
                            key: "s",
                            name: "Song",
                            value: "song"
                        },
                        {
                            key: "m",
                            name: "Movie",
                            value: "movie"
                        },
                        {
                            key: "b",
                            name: "Band",
                            value: "band"
                        },
                        {
                            key: "F",
                            name: "File",
                            value: "file"
                        },
                        {//q to quit
                            key: "Q",
                            name: "Quit",
                            value: "quit"
                        }
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
                    }else{//quit
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