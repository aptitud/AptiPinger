var cronJob = require('cron').CronJob;
var request = require('request');
var moment = require('moment');
var email = require('emailjs');
var http = require('http');
var appPort = Number(process.env.PORT || 2013);

const pingUrls = [
  "http://aptigram.apphb.com/",
  "http://aptitud.se/",
  "http://simpletweetmap.apphb.com/"
];

const TIME_FORMAT_PATTERN = "YYYY-MM-DD, HH:mm:ss:SSS Z";

for (var urlIndex = 0; urlIndex < pingUrls.length; urlIndex++) {
  var url = pingUrls[urlIndex];
  setupPingerFor(url);
}

function setupPingerFor(url) {
  try {
    new cronJob('*/5 * * * *', function() {
      var jobExecutionTime = moment();
      request(url, function(error, response, scrapedForecasts) {
        if (!error) {
          log("Success pinging URL: " + url);
        } else {
          var errorMessage = "Error pinging URL: " + url + " Error: " + error;
          log(errorMessage);
        }
      });
    }, null, true);
    log("Cron job started for URL: " + url);
  } catch (ex) {
    var errorMessage = "Cron pattern not valid: " + ex;
    log(errorMessage);
  }
}

function log(logMessage) {
  return console.log(formatDate(moment()) + " " + logMessage);
}

function formatDate(moment) {
  return moment.format(TIME_FORMAT_PATTERN);
}

var server = http.createServer(function(request, response) {
  response.writeHead(200, {
    "Content-Type": "text/html"
  });
  response.write("<!DOCTYPE html >");
  response.write("<html>");
  response.write("<head>");
  response.write("<title>Hello World Page</title>");
  response.write("</head>");
  response.write("<body>");
  response.write("Hello World!");
  response.write("</body>");
  response.write("</html>");
  response.end();
});

server.listen(appPort);
console.log("Server is listening");
