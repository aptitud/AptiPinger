var cronJob = require('cron').CronJob;
var request = require('request');
var moment = require('moment');
var email = require('emailjs');

const PING_URL = "http://aptigram.apphb.com/";
const TIME_FORMAT_PATTERN = "YYYY-MM-DD, HH:mm:ss:SSS Z";

/**
 * Cron job
 */
try {
    //new cronJob('*/15 * * * *', function () {
    new cronJob('* * * * *', function () {
        var jobExecutionTime = moment();
        request(PING_URL, function (error, response, scrapedForecasts) {
            if (!error) {
                log("Success pinging");
            } else {
                var errorMessage = "Error pinging: " + error;
                log(errorMessage);
                //sendEmail(errorMessage);
            }
        });
    }, null, true);
    log("Cron job started");
} catch (ex) {
    var errorMessage = "Cron pattern not valid: " + ex;
    log(errorMessage);
    sendEmail(errorMessage);
}

function sendEmail(message) {
    var server  = email.server.connect({
       user:        "info@aptitud.se",
       password:    "************", 
       host:        "smtp.gmail.com",
       ssl:         true
    });

    server.send({
        text:    message,
        from:    "Sjövaderprognos pinger <sjovaderprognos@gmail.com>",
        to:      "Per Jansson <per.r.jansson@gmail.com>",
        subject: "Meddelande från Sjövaderprognos pinger "
    }, function(err, message) {
        log(err || JSON.stringify(message));
    });
}

function log(logMessage) {
    return console.log(formatDate(moment()) + " " + logMessage);
}

function formatDate(moment) {
    return moment.format(TIME_FORMAT_PATTERN);
}
