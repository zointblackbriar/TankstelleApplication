var mysql = require("mysql");
var config = require("./config");
var exports = module.exports = {};
var ID, E5, E10, DIESEL, LAT, LNG, HOUSENR, NAME, POSTCODE, STREET;

//all queries related to database
var sqlQueryForDatabase = "CREATE TABLE prices (ID VARCHAR(255), E5 double ,E10 double ,DIESEL double, DATE VARCHAR(255))";
var sqlQueryForInsertion = "INSERT INTO prices (ID, E5, E10, DIESEL, DATE)";
var sqlQueryForUpdate = "UPDATE prices SET E10='1.250' WHERE E10='1.389'";
var sqlQueryForDeletion = "DELETE FROM prices WHERE E10='1.250'";
var sqlGetAllData = "SELECT * FROM prices WHERE ID = ";
var sqlCopyTable = "INSERT INTO test(ID, E5, E10, DIESEL, DATE) SELECT DISTINCT ID, E5, E10, DIESEL, DATE FROM prices";
var sqlCalculateAverage = "INSERT INTO test (ID, E5, E10, DIESEL, DATE) select ID, avg(E5) as E5, avg(E10) as E10, avg(DIESEL) as DIESEL, DATE from prices group by ID, DATE";
var sqlDeletePrices = "DELETE FROM prices";
var sqlTransferOne2Another = "INSERT INTO prices SELECT * FROM test";
var sqlDeleteTest = "DELETE FROM test";
var sqlQueryForLocationTable = "CREATE TABLE locations (ID VARCHAR(255), LAT double ,LNG double ,HOUSENR INT, NAME VARCHAR(255), POSTCODE VARCHAR(255), STREET VARCHAR(255))";
var sqlDeleteDuplicationFromLocationTable = "INSERT INTO testLoc (ID, LAT, LNG, HOUSENR, NAME, POSTCODE, STREET) SELECT DISTINCT ID, LAT, LNG, HOUSENR, NAME, POSTCODE, STREET from locations;  DELETE FROM locations; INSERT INTO locations SELECT * FROM testLoc; DELETE FROM testLoc;";
var sqlSaveLocDatabase = "INSERT INTO locations (ID, LAT, LNG, HOUSENR, NAME, POSTCODE, STREET)";
var sqlSaveOpeningHours = "INSERT INTO times (ID, ISOPEN, DAYS, HOURS)";

// Trying to setup a connection if connection lost
function startConnection()
{
    console.error('CONNECTING');
    connection = mysql.createConnection(config.mysql);
    connection.connect(function(err) {
       if(err) {
           console.error('CONNECT FAILED', err.code);
           startConnection();
       }
       else
       {
           console.error('CONNECTED');
       }
    });

    connection.on('error', function(err) {
        if(err.fatal)
            startConnection();
    });
}

startConnection();

//db test code
// testing a select every 3 seconds :
// to try the code you can stop mysql service => select will fail
// if you start mysql service => connection will restart correctly => select will succeed

/*
setInterval(function() {
    connection.query('select 1', function(err, results) {
        if(err) console.log('SELECT', err.code);
        else console.log('SELECT', results);

    });
}, 3000);
*/

    //Insert the data into the price table
    exports.queryForInsertion = function (ID, E5, E10, DIESEL)
    {

        connection.query(sqlQueryForDatabase, function(err, result) {
            try
            {
                if(err) console.log("Error: " + err.message);
                console.log("Table created");
                //TO-DO Logger will be setprice
            } catch(err)
            {
                console.log(err.message);
            }
        });
    };

    exports.queryForTableInsertion = function(ID, E5, E10, DIESEL, DATE)
    {
        try
        {
            connection.query(sqlQueryForInsertion + " VALUES (" + ID + "," + E5 + "," + E10 + "," + DIESEL + "," + DATE + ")", function (err, result) {
                if(err) console.log("Error: " + err);
                //console.log(result.affectedRows + "records inserted");
            });
        } catch (err) {
            console.log(err.message);
        }
    };

    exports.saveAllLocationToDatabase = function(data, ID, LAT, LNG, HOUSENR, NAME, POSTCODE, STREET)
    {
        try{
            connection.query(sqlSaveLocDatabase + " VALUES (" + ID + "," + LAT + "," + LNG + "," + HOUSENR + "," + NAME + "," + POSTCODE + "," +  STREET + ")", function(err, result) {
                if(err) console.log("Error:" + err);
            });
        } catch(err)
        {
            console.log(err.message);
        }
    };

    exports.deleteAllDupLoc = function(data)
    {
        try
        {
            connection.query(sqlDeleteDuplicationFromLocationTable, function(err, result) {
                if(err)console.log("Error:" + err);
            });
        } catch(err)
        {
            console.log(err.message);
        }
    };

    //save All Opening hours to the database
    exports.saveAllOpeningHoursToDatabase = function(data, times)
    {
        try
        {
            console.log(sqlSaveOpeningHours);
        } catch(err)
        {
            console.log(err.message);
        }
    };

    //Update the querz
    exports.updateQueries = function()
    {
        connection.query(sqlQueryForUpdate, function(err, result) {
            if(err) console.log("Error: " + err);
            console.log(result.affectedRows + "records updated");
        });
    };

    //Delete Queries
    exports.deleteQueries = function ()
    {
        try
        {
            connection.query(sqlQueryForDeletion, function (err, result) {
                if (err) console.log("Error: " + err);
                console.log(result.affectedRows + "records updated");
            });
        }
        catch (err)
        {
            console.log(err.message);
        }
    };

    //Fetch all data from database
    exports.asyncGetAllData = function (cb, ID)
    {
        try
        {
            connection.query(sqlGetAllData + "'" + ID + "'", function (err, result) {
                //console.log("info:" + cb);
                if (err) console.log("Error: " + err);
                else
                    {
                    cb(result);
                }
            });
        }
        catch (err)
        {
            console.log(err.message);
        }
    };

    //Delete Duplications in prices table
    exports.deleteDuplicateInTable = function ()
    {
        try
        {
            connection.query (sqlCalculateAverage, function(err, result) {
                //console.log(sqlCalculateAverage);
            });
            connection.query (sqlCopyTable, function(err, result) {
                //console.log(sqlCopyTable);
            });
            connection.query (sqlDeletePrices, function(err, result) {
                //console.log(sqlDeletePrices);
            });

            connection.query (sqlTransferOne2Another, function(err, result) {
                //console.log(sqlTransferOne2Another);
            });
            connection.query (sqlDeleteTest, function(err, result) {
                //console.log(sqlDeleteTest);
            });
            connection.query(sqlCalculateAverage, function(err, result) {
                //console.log(sqlCalculateAverage);
            });
            connection.query (sqlDeletePrices, function(err, result) {
                //console.log(sqlDeletePrices);
            });

            connection.query(sqlTransferOne2Another, function(err, result) {
                //console.log(sqlTransferOne2Another);
            });
            connection.query (sqlDeleteTest, function(err, result) {
                //console.log(sqlDeleteTest);
            });
        } catch(err)
        {
            console.log(err.message);
        }
    };
