

// Each marker is labeled with a single alphabetical character.
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
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
        markedLocations.push( [ event.latLng.lat() , event.latLng.lng() ]);
        //console.log(markedLocations);
    });

}


// Adds a marker to the map.
function addMarker(location, map) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    var marker = new google.maps.Marker({
        position: location,
        label: labels[labelIndex++ % labels.length],
        map: map
    });

    //console.log(marker.position.lat);
}



google.maps.event.addDomListener(window, 'load', initialize);
