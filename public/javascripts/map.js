var hospitals = []

function initialize() {
    labelIndex = 0; //reset labelIndex in addMarker
    fetchHospitals();


    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: { lat: 42.342132, lng: -71.103023 }, //Boston
    });



    //Create a marker on the map
    google.maps.event.addListener(map, 'click', function(marker) {
        addMarker(marker.latLng, map); //add marker to map
        getHospitalDistance(marker.latLng,hospitals); //get distance
    });

    //set the default text
    document.getElementById('origin_address').innerHTML = 'Marker Address: ';
    document.getElementById('dest_address').innerHTML = 'Closest Hospital Address: ';
    document.getElementById('distance').innerHTML = 'Distance: ';

    /*
    //heat map
    var heatmap = new google.maps.visualization.HeatmapLayer({
        data: generatePoints( [[42.3631542,-71.0710221],[42.3457464,-71.1032591],[42.3457464,-71.1032591]] ),
        map: map
    });
    */

}

var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Each marker is labeled with a letter
var labelIndex = 0;

// Adds a marker to the map.
function addMarker(location, map) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    new google.maps.Marker({
        position: location,
        label: labels[labelIndex++ % labels.length],
        map: map
    });
}


//get distance between two (long,lat) points when a marker is clicked
//https://developers.google.com/maps/documentation/javascript/examples/distance-matrix
function getHospitalDistance(origin,hospitals) {
    var distances = [];

    for (var i = 0; i < hospitals.length; i++ ) {
        var current = getDistanceFromLatLonInKm(origin.lat(),origin.lng(),hospitals[i][1][0],hospitals[i][1][1]);
        distances.push(current);
    }

    //console.log(distances);

    var minDistance = Infinity;

    for (var i = 0; i < distances.length; i++) {
        current = distances[i];
        if (current < minDistance) {
            minDistance = current;
        }
    }
    return minDistance;
}

//http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}


//generate google maps points
function generatePoints(array) {
    var result = [];
    for (var i = 0 ; i < array.length; i++) {
        result.push( new google.maps.LatLng(array[i][0],array[i][1]) );
    }
    return result;
}

function fetchHospitals(){
    $.getJSON('https://data.cityofboston.gov/api/views/46f7-2snz/rows.json?accessType=DOWNLOAD',{ },
    function(response) {

        for (var i = 0; i < response.data.length; i++) {
            hospitals.push([ response.data[i][8] , [response.data[i][14][1],response.data[i][14][2]] ] );
        }

    });

    return hospitals;

}

//load map on initialize
google.maps.event.addDomListener(window, 'load', initialize);
