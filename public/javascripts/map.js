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
        markedLocations.push( [ event.latLng.lat() , event.latLng.lng() ]);
        //console.log(markedLocations);
    });

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
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP
    });

}

//delete markers, add a button later
function clearMarkers() {
    for (var i = 0; i < markedLocations.length; i++) {
        markedLocations[i].setMap(null);
    }
    markedLocations = [];
}



google.maps.event.addDomListener(window, 'load', initialize);
