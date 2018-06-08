var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var request = require("request");
var db_connection = require("./db.js");
var os = require('os');
var URLforList = 'https://creativecommons.tankerkoenig.de/json/list.php';
var URLforDetail = 'https://creativecommons.tankerkoenig.de/json/detail.php';
var URLforPrices = 'https://creativecommons.tankerkoenig.de/json/prices.php';
var getAllTankstelleData = "ApiListTankstelle";
var apikey = "5516b9ae-d64a-0cc9-73d3-1ec432bf630d";
var apiKeyBackup = "ef2e78cb-cbab-c644-f510-c9ecd0b3d26a";
var sampleID = "4429a7d9-fb2d-4c29-8cfe-2ca90323f9f8;";
var sampleQuery = "https://creativecommons.tankerkoenig.de/json/list.php?lat=52.521&lng=13.438&rad=1.5&sort=dist&type=all&apikey=00000000-0000-0000-0000-000000000002";
//SET all environments
var port = process.env.PORT || 3002; //define the port
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true})); //to support URL-encoded bodies
app.use(bodyParser.json({extended:true}));
app.use(express.static(__dirname, '/public'));
app.set('view engine', 'ejs');
//Set HTML engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//Index page uploading
app.get('/', function (req, res)
{
    console.log('SERVER::IndexPage');
    res.sendfile(__dirname + '/public/index.html');
});

//Test.html page uploading
app.get('/test', function (req,res)
{
   console.log("SERVER::TestPage");
   res.sendfile(__dirname + '/public/test.html');
});

//routes
//ApiListTankstelle/:parameter
app.get('/StationInformation/:parameter', function(req, res, next) {
    console.log('SERVER::ApiListTankstelle');
    var str = req.url;
    var obj = str.split("&");
    var latitudeParam = obj[0].split("=")[1];
    var longitudeParam = obj[1].split("=")[1];
    var radiusParam = obj[2].split("=")[1];
    var sendingData;
    request.get(URLforList + '?lat=' + latitudeParam + '&lng=' + longitudeParam + '&rad=' + radiusParam + '&sort=dist&type=all&' + 'apikey=' + apiKeyBackup, function (error, response, body) {
        console.log(JSON.stringify(response.statusCode));
            if (JSON.stringify(response.statusCode) == "200") {
                var sendingData = response.body;
                var parsedSendingData = JSON.parse(response.body);
                //console.log("Json data" + JSON.parse(sendingData).street + JSON.parse(sendingData).name);
                if(parsedSendingData['stations'].length > 0)
                    for(var i=0; i < parsedSendingData['stations'].length; i++)
                    {

                            db_connection.saveAllLocationToDatabase(function ()
                            {

                            }, JSON.stringify(parsedSendingData['stations'][i].id),
                            parsedSendingData['stations'][i].lat,
                            parsedSendingData['stations'][i].lng,
                            parsedSendingData['stations'][i].houseNumber,
                            JSON.stringify(parsedSendingData['stations'][i].name),
                            parsedSendingData['stations'][i].postCode,
                            JSON.stringify(parsedSendingData['stations'][i].street)
                        );
                    }
                db_connection.deleteAllDupLoc();
                res.setHeader('Accept', 'application/json');
                res.writeHead(response.statusCode);
                res.write(sendingData);
                res.end();
            } else {
                res.setHeader('Accept', 'application/json');
                res.writeHead(response.statusCode);
                res.write("Error when sending a request for StationInformation");
                res.end();
            }
    });
});

//Test Request from a mock html page
app.get('/test/StationInformation/:parameter', function(req, res, next){
    console.log('SERVER::TESTApiListTankstelle');
    console.log(req.url);
    //var str = req.params.parameters;
    var str=req.url;
    var obj = str.split("&");
    var latitudeParam = obj[0].split("=")[1];
    var longitudeParam = obj[1].split("=")[1];
    var radiusParam = obj[2].split("=")[1];
    var sendingData;
        request.get(URLforList + '?lat=' + latitudeParam + '&lng=' + longitudeParam + '&rad=' + radiusParam + '&sort=dist&type=all&' + 'apikey=' + apiKeyBackup, function(error, response, body) {
                if(response.statusCode == "200" || JSON.parse(response.body).status != "error")
            {
                var sendingData = response.body;
                res.setHeader('Accept', 'application/json');
                res.writeHead(response.statusCode);
                res.write(sendingData);
                res.end();
            } else
            {
                res.setHeader('Accept', 'application/json');
                res.writeHead(response.statusCode);
                res.write("Error when sending a request for StationInformation");
                res.end();
            }

        });
    //app.use(errorHandler);
});

//Opening Hours Request
app.get("/OpeningHours/:parameter", function (req, res, next) {
    console.log('SERVER::TESTOpeningHours');
    var str=req.url;
    var obj = str.split("&");
    var ID = obj[0].split("/")[2];

        request.get(URLforDetail + '?id=' + ID + '&apikey=' + apiKeyBackup, function (error, response, body) {
                if(response.statusCode = "200" || JSON.parse(response.body).status != "error")
                {
                    var sendingData = response.body;
                    var parsedSendingData = JSON.parse(sendingData);
                    //console.log(parsedSendingData);
/*
                    if(parsedSendingData['station'].length > 0)
                        for(var i=0; i < parsedSendingData['station'].length; i++)
                        {

                            db_connection.saveAllOpeningHoursToDatabase(function ()
                                {

                                }, JSON.stringify(parsedSendingData['station'][i].id,
                                   JSON.stringify(parsedSendingData['station'][i].openingTimes))
                            );

                        }
*/
                var newObj = JSON.parse(sendingData);
                console.log(newObj['station']['openingTimes'][0]);
                console.log(newObj['station']['openingTimes'][1])
                //if(newObj['openingTimes'].length > 0)
/*
                for(var i = 0; i < newObj['openingTimes'].length; i++)
                {
                    console.log("opening times" + JSON.parse(newObj['openingTimes'][i]));

                }
*/
                    res.setHeader('Accept', 'application/json');
                    res.writeHead(res.statusCode);
                    res.write(sendingData);
                    res.end();
                } else
                    {
                    res.setHeader('Accept', 'application/json');
                    res.writeHead(res.statusCode);
                    res.write('Error \n');
                    //res.write("API result could not back to you");
                    res.end("API result could not back to you");
                }
    });
});

//Test Request from a mock html page
app.get("test/OpeningHours/:parameter", function (req, res, next) {
    console.log('SERVER::TESTOpeningHours');
    var str=req.url;
    var obj = str.split("&");
    var ID = obj[0].split("/")[2];

    request.get(URLforDetail + '?id=' + ID + '&apikey=' + apiKeyBackup, function (error, response, body) {
        if(response.statusCode = "200" || JSON.parse(response.body).status != "error")
        {
            var sendingData = response.body;
            var parsedSendingData = JSON.parse(sendingData);
            res.setHeader('Accept', 'application/json');
            res.writeHead(res.statusCode);
            res.write(sendingData);
            res.end();
        } else
        {
            res.setHeader('Accept', 'application/json');
            res.writeHead(res.statusCode);
            res.write('Error \n');
            res.end("API result could not back to you");
        }
    });
});

//Price Trend Request
app.get('/getPriceTrend/:parameter', function(req, res, next) {
    console.log('SERVER::GetPriceTrend');
    db_connection.deleteDuplicateInTable();
    console.log(req.url);
    var str=req.url;
    var obj = str.split("&");
    var ID = obj[0].split("/")[2];

    db_connection.asyncGetAllData(function(data)
    {
        console.log(JSON.stringify(data));
        res.setHeader('Accept', 'application/json');
        res.writeHead(res.statusCode);
        res.write(JSON.stringify(data));
        res.end();
    }, ID);
});


//Test Request from a mock html page
app.post('/test/makeSnapshot', function(req, res, next) {
    console.log('SERVER::testMakeSnapshot');
    if(req.body.stations.length > 0)
        for(i = 0; i < req.body.stations.length; i++)
        {
            db_connection.queryForTableInsertion(JSON.stringify(req.body.stations[i].id), req.body.stations[i].e5, req.body.stations[i].e10, req.body.stations[i].diesel, JSON.stringify(req.body.stations[i].date));
        }
    else
    {
        console.log("Station JSON format is not true");
    }
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(res.statusCode);
        res.end(JSON.stringify({
            "JSON data" : "saved"
        }));
});

//Snapshot request for database
app.post('/makeSnapshot', function(req, res, next) {
    console.log('SERVER::makeSnapshot');
    if(req.body.stations.length > 0)
        for(i = 0; i < req.body.stations.length; i++)
        {
            db_connection.queryForTableInsertion(JSON.stringify(req.body.stations[i].id), req.body.stations[i].e5, req.body.stations[i].e10, req.body.stations[i].diesel, JSON.stringify(req.body.stations[i].date));
        }
    else
    {
        console.log("Station JSON format is not true");
    }
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(res.statusCode);
        //The following piece of code will send information from the database
        //res.write();
        res.end(JSON.stringify({
            "JSON data" : "saved"
        }));
});

//Error Handler
function errorHandler(err, req, res, next)
{
    if(res.headersSent)
    {
        return next(err);
    }
    res.status(404);
    res.render('error', {error: err});
}

//Get IP address of this server
  var getIpAddress = function()
  {
      var ifaces = os.networkInterfaces();
        var ips = 0;

        for(var dev in ifaces)
        {
            ifaces[dev].forEach(function(details){
                //console.log(details);
               if(details.family == 'IPv4' && details.internal == false)
               {
                   //ips[dev+(alias?':'+alias:'')] = details.address;
                   ips = details.address;
               }
            });
        }
      return ips;
  };

console.log("Server IP address is: " + getIpAddress());

//routes =================================
require('./app/routes')(app); //pass our application into our routes
app.listen(port);
console.log('Application listening on port 3002');
exports = module.exports = app;