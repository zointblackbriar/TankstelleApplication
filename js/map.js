/**
 * Created by zointBlackBriar on 7/22/2017.
 */
var contents = [];
//local for markers
var local= [];
//stationJSON for snapshot
var stationsJSON = {stations:[]};
var initMaplat = 0;
var initMaplng = 0;
var stationIDs;
var getPriceTrendData;
var contentInfo;

var map;
var infowindow;





//when click marker show info
function markersTextTinfo(marker,s,r,map,infowindow){
    marker.addListener('click', function()
    {
        //for click mark
        infowindow.close();

        infowindow.open(map, marker);

        //info text
        getOpenHours(r.id);
        //  document.getElementById("textInfo").innerHTML=s;
        //chart
        getPriceTrends(r.id);
        //snapshot button
        var btn = document.getElementById("snapshot");
        btn.className = "btn btn-success btn-lg snapshot";
        btn.style.visibility = 'visible';       // show button
        btn.innerHTML = "Snapshot";
        btn.onclick = function(){
            postSnapshot();
        }



    });
}

//this function you can try snapshot post
function postSnapshot()
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "/makeSnapshot", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.onreadystatechange = function() {//Call a function when the state changes.
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            console.log(xmlhttp.response);
        }
    };
    xmlhttp.send(JSON.stringify(stationsJSON));
    
}

//for HTTP GET
var markers;

function getStationInfo(latitudeParam, longitudeParam, radiusParam, callback) {
    
    contents = [];
    xmlhttp = new XMLHttpRequest();
    var xmlhttp = new XMLHttpRequest();
    initMaplat = latitudeParam;
    initMaplng = longitudeParam;
    var paramCombined = "/lat=" + latitudeParam + "&" + "lng=" + longitudeParam + "&" + "rad=" + radiusParam;
    var sendRESTStationInfo = "/StationInformation" + paramCombined;
    var sendRESTOpeningHours = "/OpeningHours/";
    var stationOpeningHour;
    
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200)
        {
            try {
                var station = JSON.parse(this.responseText);
                
                //for the date
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1;
                var yyyy = today.getFullYear();

                if(dd < 10)
                {
                    dd = '0' + dd;
                }

                if(mm < 10)
                {
                    mm = '0' + mm
                }

                today = mm + '/' + dd + '/' + yyyy;
                var contentString="";
                for (var i = 0 in station.stations) {
                    contentString = "<pre class='star-primary'><h4 class='text-center'>" + station.stations[i].name+"</h4>City: "+ station.stations[i].place + "<br>Address: " + station.stations[i].street+ " " + station.stations[i].houseNumber + "<br>Diesel: " + station.stations[i].diesel + "<br>E5: " + station.stations[i].e5 + "<br>E10: " + station.stations[i].e10 + "<br>isOpen: "+ station.stations[i].isOpen +"</pre>";
                    //count > 0 then data overlay!

                    var count = stationsJSON.stations.filter(function(item) {
                        return station.stations[i].id == item.id;
                    }).length;

                    if (count == 0)
                    {   
                        //for markers
                        local.push({"lat": station.stations[i].lat, "lng": station.stations[i].lng});
                        //for snapshot
                        stationsJSON.stations.push({"id": station.stations[i].id, "e5": station.stations[i].e5, "e10": station.stations[i].e10, "diesel": station.stations[i].diesel,"date": today});
                        //for markers contents (useless)
                        contents.push(contentString);
                    }
                }

                //type = funnction then callback! avoid 同步
                // console.log("TYPE:", typeof(callback));
                if (typeof(callback) == 'function') {
                    callback();
                }

            } catch(err)
            {
                console.log("Error:" + err.message);
            }
        }
    };
    xmlhttp.open("GET", sendRESTStationInfo, true);
    xmlhttp.send(null);
    //  console.log(sendRESTStationInfo);
}

function getPriceTrends(id)
{
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "/getPriceTrend/" + id, true);
    xmlhttp.onreadystatechange = function() {
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
                getPriceTrendData=[['Time', 'E10', 'E5', 'Diesel']];
                var station = JSON.parse(this.responseText);
                if(station.length>0&&station.length<6)
                {
                    for(var i=0;i<station.length;i++){

                        var singleData = [];
                        var e10 = station[i].E10;
                        var e5 = station[i].E5;
                        var  diesel= station[i].DIESEL;
                        if(e10 == null){
                            e10 =0;
                        }

                        if(e5==null){
                            e5=0;
                        }

                        if(diesel == null){
                            diesel=0;
                        }

                        singleData.push(station[i].DATE,e10,e5,diesel);
                        getPriceTrendData.push(singleData);
                    }
                    loadChart();
                }
                else if(station.length > 5)
                {
                   for(var i=station.length-5;i<station.length;i++){

                         var singleData = [];
                        var e10 = station[i].E10;
                        var e5 = station[i].E5;
                        var  diesel= station[i].DIESEL;
                        if(e10 == null){
                            e10 =0;
                        }

                        if(e5==null){
                            e5=0;
                        }

                        if(diesel == null){
                            diesel=0;
                        }

                        singleData.push(station[i].DATE,e10,e5,diesel);
                        getPriceTrendData.push(singleData);
                    }
                    loadChart();
                }
             
        }
    };
    xmlhttp.send(null);
}


function getOpenHours(id)
{
    var xmlhttp = new XMLHttpRequest();
    var url = "/OpeningHours/" +id;

    // console.log(url);
    xmlhttp.onreadystatechange = function()
    {
        
        if (this.readyState == 4 && this.status == 200) {
        try
        {
            // for (i in station.stations) {
            var station = JSON.parse(this.response);
         
            var opentime = "<br>OpeningTimes: ";
            for(o in station.station.openingTimes){

                opentime +=  "<br>" + station.station.openingTimes[o].text + ": " + station.station.openingTimes[o].start + " to " + station.station.openingTimes[o].end;

            }
            var contentString="";
            contentString ="<pre class='star-primary'><h4 class='text-center'>"+ station.station.name+ "</h4>City: "+ station.station.place + "<br>Address: " + station.station.street + " " + station.station.houseNumber+ "<br>Diesel: " + station.station.diesel + "<br>E5: " + station.station.e5 + "<br>E10: " + station.station.e10 + "<br>isOpen: " + station.station.isOpen + opentime + "</pre>";

            document.getElementById("textInfo").innerHTML = contentString;

        } catch(err)
        {
            console.log("getOpenHours Error:" + err.message);
        }
      }

    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);
}

function initMap() {
    var circle;
    // Create an array of alphabetical characters used to label the markers.
    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // Add some markers to the map.
    // Note: The code uses the JavaScript Array.prototype.map() method to
    // create an array of markers based on a given "locations" array.
    // The map() method here has nothing to do with the Google Maps API.
    //自加

    function initialize() {
        var lat;
        var lng;
        var radius;

        var mapOptions = {
            center: new google.maps.LatLng(50.8357, 12.92922),
            zoom: 13

        };
        
         map = new google.maps.Map(document.getElementById('mapChemnitz'), mapOptions);
        //     var markerCluster = new MarkerClusterer(mapBerlin, markers, {
        //     imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
        // });

        infowindow = new google.maps.InfoWindow({
            content: "You click here"
        });

        getStationInfo(50.8357,12.92922, 4, function(){
        for (var i = 0; i < contents.length; ++i) {
                    var marker = new google.maps.Marker({
                        position: local[i],
                        map: map
                    });
                    //marker: addlistener, contents[i]: stationinfo, stationJSON: getopenning hour
                    //mapBerlin: Click then mark
                    markersTextTinfo(marker, contents[i], stationsJSON.stations[i], map, infowindow);
                }
            });

        

        var drawingManager = new google.maps.drawing.DrawingManager({
            //drawingMode: google.maps.drawing.OverlayType.MARKER,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.BOTTOM_CENTER,
                drawingModes: [
                    google.maps.drawing.OverlayType.CIRCLE]
            },
            circleOptions: {
                fillColor: '#ffff00',
                fillOpacity: 0.25,
                strokeWeight: 5,
                clickable: false,
                editable: false,
                zIndex: 1
            }
        });
        drawingManager.setMap(map);
        google.maps.event.addListener(drawingManager, 'circlecomplete', onCircleComplete);
    }
    function onCircleComplete(shape) {
        if (shape == null || (!(shape instanceof google.maps.Circle))) return;

        if (circle != null) {
            circle.setMap(null);
            circle = null;
        }

        circle = shape;
        lat= circle.getCenter().lat();
        lng = circle.getCenter().lng();
        radius = circle.getRadius() / 1000;
        getStationInfo(lat,lng, radius, function()
        {

            for (var i = 0; i < local.length; i++)
            {
                var marker = new google.maps.Marker({
                    position: local[i],
                    map: map
                });
                markersTextTinfo(marker, contents[i], stationsJSON.stations[i], map, infowindow);
            }
        });
    }

    google.maps.event.addDomListener(window, 'load', initialize);

}

//chart
function loadChart(){
    //chart start

    google.charts.load('current', {
        'packages': ['corechart']
    });
//Load the Visualization API library and the piechart library
    google.charts.setOnLoadCallback(drawChart);


    //google.load('visualization', '1.0', {'packages':['corechart']});
}



function drawChart()
{
    try
    {
        var data = google.visualization.arrayToDataTable(getPriceTrendData);

        var options = {
            title: 'Gas Prices',
            curveType: 'function',
            legend: {
                position: 'bottom'
            },

            // 'width': 600,
            'height':300

        };
        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        chart.draw(data, options);
    } catch(err)
    {
        console.log(err.message);
    }

}

