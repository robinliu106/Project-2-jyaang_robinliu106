//get hospital data in format : [ name,coord[] ]
function fetchHospitals(){
    var hospitals = [];
    $.getJSON('https://data.cityofboston.gov/api/views/46f7-2snz/rows.json?accessType=DOWNLOAD',{ },
    function(response) {

        for (var i = 0; i < response.data.length; i++) {
            hospitals.push([ response.data[i][8] , [response.data[i][14][1],response.data[i][14][2]] ] );
        }

    });

    return hospitals;

}


function initialize() {

    var hospitals = fetchHospitals();
    //console.log(hospitals);
    labelIndex = 0; //reset labelIndex in addMarker

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: { lat: 42.342132, lng: -71.103023 }, //Boston
    });

    //Create a marker on the map
    google.maps.event.addListener(map, 'click', function(marker) {
        addMarker(marker.latLng, map); //add marker to map
        getDistance(marker.latLng,hospitals); //get distance for hospital

    });

    //set the default text
    document.getElementById('origin_address').innerHTML = 'Marker Address: ';
    document.getElementById('dest_address').innerHTML = 'Closest Hospital Address: ';
    document.getElementById('distance').innerHTML = 'Distance: ';

    //heat map
    /*
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
function getDistance(origin, type) {
    var service = new google.maps.DistanceMatrixService();

    var hospitals = generatePoints(type);
    console.log(hospitals);

    service.getDistanceMatrix({
        origins: [origin],
        destinations: hospitals,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL
    }, callback);

    //parse response
    function callback(response, status) {
        if (status == "OK") {

            //view the json response in console
            console.log(JSON.stringify(response,null,4));

            //calculate minimum distance
            var minDistance = Infinity;
            var counter = 0 //track which one is the min.
            for (var i = 0; i < response.rows[0].elements.length; i++) {
                var currentDistance = response.rows[0].elements[i].distance.value;
                if (currentDistance < minDistance) {
                    minDistance = currentDistance;
                    counter = i;
                }
            }

            //replace text in view
            document.getElementById('origin_address').innerHTML = 'Marker Address: ' + response.originAddresses;
            document.getElementById('dest_address').innerHTML = 'Closest Hospital Address: ' + response.destinationAddresses[counter];
            document.getElementById('distance').innerHTML = 'Distance: ' + minDistance + ' meters';

        } else {
            console.log('didnt work');
        }
    }

}

//generate google maps points
function generatePoints(array) {
    //console.log(array);
    //var test = [[42.3631542,-71.0710221],[42.3457464,-71.1032591],[42.3457464,-71.1032591]];
    var result = [];

    for (var i = 0 ; i < array.length; i++) {
        //result.push(new google.maps.LatLng(test[i][0],test[i][1]));
        //console.log(new google.maps.LatLng(parseFloat(array[i][1][0]),parseFloat(array[i][1][1])));
        result.push( new google.maps.LatLng(parseFloat(array[i][1][0]),parseFloat(array[i][1][1])));
    }

    //console.log(result);
    return result;

}




google.maps.event.addDomListener(window, 'load', initialize);
