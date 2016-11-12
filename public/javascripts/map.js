
function initialize() {
    var markedLocations = [];
    labelIndex = 0; //reset labelIndex in addMarker

    var boston = { lat:42.342132, lng: -71.103023 };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: boston
    });

    //Create a marker on the map
    google.maps.event.addListener(map, 'click', function(marker) {
        addMarker(marker.latLng, map); //add marker to map
        markedLocations.push(marker.latLng); //save marker
        getDistance(marker.latLng); //get distance
    });

    //map these values to index page
    var origin_address = document.getElementById('origin_address');
    var dest_address = document.getElementById('dest_address');
    var distance_in_meters = document.getElementById('distance_in_meters');

    //set the default text
    origin_address.innerHTML = 'Marker Address: ';
    dest_address.innerHTML = 'Closest Hospital Address: ';
    distance_in_meters.innerHTML = 'Distance: ';


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

//get distance between two (long,lat) points when a marker is clicked
//https://developers.google.com/maps/documentation/javascript/examples/distance-matrix
function getDistance(origin) {
    var service = new google.maps.DistanceMatrixService();

    //test data
    var hospitalsList = [ [42.3631542,-71.0710221] , [42.3457464,-71.1032591] , [42.3457464,-71.1032591] ];
    var hospitals = generatePoints(hospitalsList);

    //get distance
    service.getDistanceMatrix({
        origins: [origin],
        destinations: hospitals,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL
    }, callback);

    //parse response
    function callback(response, status) {
        if (status == "OK") {

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
        result.push( new google.maps.LatLng(array[i][0],array[i][1]) );
    }
    return result;
}


google.maps.event.addDomListener(window, 'load', initialize);
