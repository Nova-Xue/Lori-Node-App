var writeLog = require("./log.js").writeLog;
//fs to read command from the user input filename
exports.readCommand = function (fileName) {
    //read the file
    var fs = require("fs");
    if(fs.existsSync(fileName)){//file exists
        var cmd = fs.readFileSync(fileName).toString().split(",");
        if (cmd.length > 2) {//command with wrong format
            cmdObj =  "I can not do this";
            writeLog("Search " + fileName + " by file at ", "fail");
        } else {//correct command
            writeLog("Search " + fileName + " by file at ", "success");
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