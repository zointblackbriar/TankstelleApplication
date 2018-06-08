//Logging library
var winston = require('winston');

exports.loggerSet = function() {
    var myCustomLevels = {
        levels: {
            warning: 0,
            error: 1,
            debug: 2
        },
        colors: {
            warning: 'yellow',
            error: 'red',
            debug: 'gray'
        }
    };

    var customLevelLogger = new (winston.Logger({levels: myCustomLevels.levels}));
    winston.addColors(myCustomLevels.colors);
};

module.exports="logging";
