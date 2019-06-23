//includ chalk
var chalk = require("chalk");
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
function search(type, url) {
    //get response
    axios.get(url).then((resp) => {
        console.log(resp);
        //display response here
    });
}
function searchSpotify(keyWord) {
    //search spotify for a track
    // {
    //     id : process.env.SPOTIFY_ID,
    //     secret : process.env.SPOTIFY_SECRECT
    // }
    var spotify = new Spotify(key.spotify);
    spotify.search({//search for a track
        type: "track",
        query: keyWord
    }, function (err, data) {
        if (err) {
            return console.log(err + "from spotify api");

        }
        console.log(data);
        //display data here
    });
}
//check type and form queryurl with keyword
function checkCatalog(str1, str2) {
    if (str2 != "quit") {//quit when user inputs 'quit'
        console.log("Lori is searching for " + str1);
        var query;
        switch (str2) {
            case "song":
                searchSpotify(str1);
                break;
            case "movie":
                query = "http://www.omdbapi.com/?i=tt3896198&apikey=cc25cce6&t=" + str1;
                search(str1, query);
                break;
            case "band":
                query = "https://rest.bandsintown.com/artists/" + str1 + "/events?app_id=56dd8586-3ef3-4a59-aead-f3c9135af348";
                search(str1, query);
                break;
            default://in case in put from expand went wrong //not necessary
                console.log("I cannot search for " + str2);
                console.log("Please wait for further update");
                welcome();//go back to main function if input from last prompt goes wrong
        }

    } else {
        console.log("Thank you for using Lori the Bot!");
    }
}
//main function 
function welcome() {
    console.log("What can I do for you?");
    console.log("You can quit the bot at anytime just typing in \'quit\'.");
    inquirer.prompt({//ask for key
        tyep: "input",
        name: "search",
        message: "Search for something :",
        default: "A song, a movie, or your favorite band"
    }).then((answer) => {
        if (answer.search != "quit") {
            let key = answer.search;
            inquirer.prompt({//ask for type//single choice
                type: "expand",
                name: "catalog",
                message: "Is " + key + " a song, a movie or a band? (You can type q to quit)",
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
                    {//q to quit
                        key: "Q",
                        name: "Quit",
                        value: "quit"
                    }
                ]
            }).then((answer) => {
                if (answer.catalog != "quit") {//user input not to quit
                    checkCatalog(key, answer.catalog);
                    //
                    inquirer.prompt({//ask user to continue or not
                        type: "confirm",
                        name: "again",
                        message: "Do you need to search anything else?",
                        default: true
                    }).then((answer) => {
                        if (answer.again) {
                            welcome();//call main function to continue
                        } else {//quit
                            console.log("Thank you for using Lori the Bot!");
                        }
                    });
                }
            });
        } else {//quit
            console.log("Thank you for using Lori the Bot!");
        }
    });
}
//show once when enter the bot
console.log("Welome to Lori the Bot!");
//call main function
welcome();