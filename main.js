//includ chalk
var chalk = require("chalk");
//include file stream
var fs = require("fs")
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
function writeLog(action,status){
    fs.appendFileSync("log.txt",action+new Date()+status+" | ",function(err){
        if(err){
            console.log(err);
        }
    });
}
function readCommand(fileName){
    //read the file
    var keyWord;
    var catalog;
    fs.readFileSync(fileName,"utf-8",function(err,data){
        if(err){
            console.log("cannot read file "+ fileName);
        }
        console.log(data);
        //deal with data
        var command = data.split(",");
        catalog = command[0];
        keyWord = command[1];

    });
    return {
        keyword : keyWord,
        catalog : catalog
    }
}
function search(type, url) {
    //get response
    axios.get(url).then((resp) => {
        console.log(resp);
        //display response here
        //check type to format json 
        if(type == "movie"){
            //movie format
        }else if(type == "band"){
            //concert format
        }else{
            return console.log("wrong type");
        }
        //save to log.txt
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
        //save search action to log.txt
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
                query = key.omdb.prefix + str1;
                search(str2, query);
                break;
            case "band":
                query = key.bit.prefix + str1 + key.bit.id;
                console.log(query);
                
                search(str2, query);
                break;
            case "file":
                //read file function
                console.log("Lori is reading the file");
                var fileCommand = readCommand(str1);
                checkCatalog(fileCommand.keyword,fileCommand.catalog);
                //execute command function 
                break;
            default://in case in put from expand went wrong //not necessary
                //save failure info to log
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
    console.log("You can quit the bot at anytime by typing in \'quit\'.");
    inquirer.prompt({//ask for key
        tyep: "input",
        name: "search",
        message: "Search for something or read command from a file:",
        default: "A song, a movie, your favorite band or a file name"
    }).then((answer) => {
        if (answer.search != "quit") {
            let key = answer.search;
            inquirer.prompt({//ask for type//single choice
                type: "expand",
                name: "catalog",
                message: "Is " + key + " a song, a movie, a band or a file? (You can type q to quit)",
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