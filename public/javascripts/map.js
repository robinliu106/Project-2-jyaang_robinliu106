//initialize array of marked locations
var markedLocations = [];


function initialize() {
    var boston = { lat:42.342132, lng: -71.103023 };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: boston
    });

    // This event listener calls addMarker() when the map is clicked.
    google.maps.event.addListener(map, 'click', function(event) {
        addMarker(event.latLng, map);
        //push marker to array markedLocations
        markedLocations.push( [ event.latLng.lat() , event.latLng.lng() ] );
        //find distance between marked point and various locations
        getDistance( [event.latLng.lat() , event.latLng.lng()] );
    });

    //map these values to index page
    var origin_address = document.getElementById('origin_address');
    var dest_address = document.getElementById('dest_address');
    var distance_in_meters = document.getElementById('distance_in_meters');

}

// Each marker is labeled with a single alphabetical character.
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
// Adds a marker to the map.
function addMarker(location, map) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    var marker = new google.maps.Marker({
        position: location,
        label: labels[labelIndex++ % labels.length],
        map: map
    });

}

//delete markers button
function removeMarkers() {
    markedLocations = []; //reset markedLocations to null
    labelIndex = 0; //reset labelIndex to 0

    //wipe addresses
    origin_address.innerHTML = 'Marker Address: ';
    dest_address.innerHTML = 'Closest Hospital Address: ';
    distance_in_meters.innerHTML = 'Distance: ';

    initialize(); //reload the map with no markers
}



//get distance between two (long,lat) points when a marker is clicked
//documentation
//https://developers.google.com/maps/documentation/javascript/examples/distance-matrix
function getDistance(origin) {

    var origin = new google.maps.LatLng(origin[0],origin[1]);

    //test
    var hospitalsList = [ [42.3631542,-71.0710221] , [42.3457464,-71.1032591] , [42.3457464,-71.1032591] ];
    var hospitals = generatePoints(hospitalsList);
    //alert(hospitals);

    var service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix({
        origins: [origin],
        destinations: hospitals,
        travelMode: google.maps.TravelMode.DRIVING,
        avoidHighways: false,
        avoidTolls: false,
        unitSystem: google.maps.UnitSystem.IMPERIAL
    },
    callback);

    function callback(response, status) {
        if (status == "OK") {

            //calculate minimum distance
            var minDistance = Infinity;
            var counter = 0
            for (var i = 0; i < response.rows[0].elements.length; i++) {
                var currentDistance = response.rows[0].elements[i].distance.value;
                if (currentDistance < minDistance) {
                    minDistance = currentDistance;
                    counter = i;
                }
            }

            //show in index page
            origin_address.innerHTML = 'Marker Address: ' + response.originAddresses;
            dest_address.innerHTML = 'Closest Hospital Address: ' + response.destinationAddresses[counter];
            distance_in_meters.innerHTML = 'Distance: ' + minDistance + ' meters';
        } else {
            alert("Error: " + status);
        }

    }

}

function generatePoints(array) {
    var result = [];
    for (var i = 0 ; i < array.length; i++) {
        var point = new google.maps.LatLng(array[i][0],array[i][1]);
        result.push( point );
    }
    return result;
}


google.maps.event.addDomListener(window, 'load', initialize);
