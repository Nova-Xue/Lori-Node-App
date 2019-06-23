//includ chalk
var chalk = require("chalk");
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
function writeLog(action,status){
    var fs = require("fs");//include fs to append file
    fs.appendFile("log.txt",action+new Date()+status+" | ",function(err){
        if(err){
            console.log(err);
        }
    });
}
function readCommand(fileName){
    //read the file
    var fs = require("fs");
    var cmd = fs.readFileSync(fileName).toString().split(",");
    //return the catalog and key word from txt file 
    return {
        fileKey : cmd[1],
        fileCatalog : cmd[0]
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
            //write log
            
        }else if(type == "band"){
            //concert format
        }else{
            return console.log("wrong type");
        }
        //save to log.txt
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
        console.log(data);
        //display data here
        //save search action to log.txt
    });
}
//check type and form queryurl with keyword
//write log when the search is done
function checkCatalog(str1, str2) {
    if (str2 != "quit") {//quit when user inputs 'quit'
        console.log(chalk.blue.bold("Lori is searching for " + str1+"."));
        var query;
        switch (str2) {
            case "song":
                if(searchSpotify(str1)){
                    writeLog("Search "+str1+" by "+str2 +" at ","success");
                }else{
                    writeLog("Search "+str1+" by "+str2 +" at ","fail");
                }
                break;
            case "movie":
                query = key.omdb.prefix + str1;
                if(search(str2, query)){
                    writeLog("Search "+str1+" by "+str2 +" at ","success");
                }else{
                    writeLog("Search "+str1+" by "+str2 +" at ","fail");
                }
                
                break;
            case "band":
                query = key.bit.prefix + str1 + key.bit.id;
                if(search(str2, query)){
                    writeLog("Search "+str1+" by "+str2 +" at ","success");
                }else{
                    writeLog("Search "+str1+" by "+str2 +" at ","fail");
                }
                break;
            case "file":
                //read file function
                console.log(chalk.blue.bold("Lori is reading the file."));
                var fileCommand = readCommand(str1);
                //checkCatalog(fileCommand.fileKey,fileCommand.fileCatalog);
                if(checkCatalog(fileCommand.fileKey,fileCommand.fileCatalog)){
                    writeLog("Search "+str1+" by "+sr2 +" at ","success");
                }else{
                    writeLog("Search "+str1+" by "+str2 +" at ","fail");
                }
                break;
            default://in case in put from expand went wrong //not necessary
                //save failure info to log
                console.log("I cannot search for " + str2);
                console.log("Please wait for further update");
                writeLog("Search "+str1+" by "+str2 +" at ","fail");
                welcome();//go back to main function if input from last prompt goes wrong
        }

    } else {
        console.log(chalk.blue.bold("Thank you for using Lori the Bot!"));
    }
}
//main function 
//
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
            inquirer.prompt({//ask for type//single choice
                type: "expand",
                name: "catalog",
                message: chalk.blue("Is ")+ chalk.green(key) + chalk.blue(" a ")+chalk.yellow("song")+chalk.blue(", a ")+chalk.yellow("movie")+chalk.blue(", a ")+chalk.yellow("band")+chalk.blue(" or a ")+chalk.yellow("file")+chalk.blue("? ")+chalk.red.bold("(You can type q to quit,type h or enter for help)"),
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
                        message: chalk.blue.bold("Do you need to search anything else?"),
                        default: true
                    }).then((answer) => {
                        if (answer.again) {
                            welcome();//call main function to continue
                        } else {//quit
                            console.log(chalk.blue.bold("Thank you for using Lori the Bot!"));
                        }
                    });
                }
            });
        } else {//quit
            console.log(chalk.blue.bold("Thank you for using Lori the Bot!"));
        }
    });
}
//show once when enter the bot
console.log(chalk.blue.bold("Welome to Lori the Bot!"));
//call main function
welcome();