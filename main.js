//includ chalk
var chalk = require("chalk");
//include inquirer for interaction
var inquirer = require("inquirer");
//include checkCatalog
var checkCatalog = require("./query.js").checkCatalog;
//check type and form queryurl with keyword
//write log when the search is done
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
            } else {//input == ""
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