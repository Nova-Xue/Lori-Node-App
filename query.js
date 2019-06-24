//includ chalk
var chalk = require("chalk");
var writeLog = require("./log.js").writeLog;
var readCommand = require("./read-command.js").readCommand;
var search = require("./api.js").search;
var searchSpotify = require("./api.js").searchSpotify;
//get api key from key.js
require("dotenv").config();
var key = require("./key.js");
exports.checkCatalog = function checkCatalog(str1, str2) {
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
            else {//not a txt file
                console.log(chalk.red.bold("I cannot read non-txt file " + str1));
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