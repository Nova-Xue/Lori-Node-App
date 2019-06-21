var chalk = require("chalk");
var axios = require("axios");
var inquirer = require("inquirer");
var dotenv = require("dotenv");
dotenv.config();
function search(type,url) {
    axios.get(url).then((resp) => {
        console.log(resp);
        
        return resp;
    });
}
function checkCatalog(str1, str2) {
    if (str2 != "quit") {
        console.log("Lori is searching for " + str1);
        var query;
        switch (str2) {
            case "song":
                query = "https://api.spotify.com/v1/search?q=" + str1;
                break;

            case "movie":
                query = "http://www.omdbapi.com/?i=tt3896198&apikey=cc25cce6&t=" + str1;
                break;

            case "band":
                query = "https://rest.bandsintown.com/artists/" + str1 + "/events?app_id=56dd8586-3ef3-4a59-aead-f3c9135af348";
                break;

            default:
                console.log("I cannot search for " + str2);
                console.log("Please wait for further update");
                welcome();
        }
        search(str2,query);
    } else {
        console.log("Thank you for using Lori the Bot!");
    }

}
function welcome() {
    console.log("What can I do for you?");
    console.log("You can quit the bot at anytime just typing in \'quit\'.");
    inquirer.prompt({
        tyep: "input",
        name: "search",
        message: "Search for something :",
        default: "A song, a movie, or your favorite band"
    }).then((answer) => {
        if (answer.search != "quit") {
            let key = answer.search;
            console.log(key);

            inquirer.prompt({
                type: "expand",
                name: "catalog",
                message: "Is " + key + " a song, a movie or a band? (You can type q to quit)",
                choices: [
                    {
                        key: "A",
                        name: "Song",
                        value: "song"
                    },
                    {
                        key: "B",
                        name: "Movie",
                        value: "movie"
                    },
                    {
                        key: "C",
                        name: "Band",
                        value: "band"
                    },
                    {
                        key: "Q",
                        name: "Quit",
                        value: "quit"
                    }
                ]
            }).then((answer) => {
                console.log(answer.catalog);

                if (answer.catalog != "quit") {
                    checkCatalog(key, answer.catalog);
                    inquirer.prompt({
                        type: "confirm",
                        name: "again",
                        message: "Do you need to search anything else?",
                        default: true
                    }).then((answer) => {
                        if (answer.again) {
                            welcome();
                        } else {
                            console.log("Thank you for using Lori the Bot!");

                        }
                    });
                }
            });

        } else {
            console.log("Thank you for using Lori the Bot!");
        }
    });


}

console.log("Welome to Lori the Bot!");
welcome();