//fs to write (append) log to log.txt
exports.writeLog = function writeLog(action, status) {
    var fs = require("fs");
    var fs = require("fs");//include fs to append file
    fs.appendFile("log.txt", action + new Date() + status + " | ", function (err) {
        if (err) {
            console.log(err);
        }
    });
}
