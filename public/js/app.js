document.addEventListener('DOMContentLoaded', function() {
    var defaultLat = 40.7128; // Default Latitude
    var defaultLng = -74.0060; // Default Longitude
    var radius = 6000; // Radius in meters (adjustable)

    // Initializes the map and adds markers
    function initMap(lat = defaultLat, lng = defaultLng) {
        var mapOptions = {
            center: new google.maps.LatLng(lat, lng),
            zoom: 16, // Adjust the zoom level so the circle fits well
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        // Define and add the circle to the map
        var circle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: new google.maps.LatLng(lat, lng),
            radius: radius
        });

        // Fetch and add markers to the map
        fetch('data/markers.json')
            .then(response => response.json())
            .then(markersData => {
                markersData.forEach(function(data) {
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(data.lat, data.lng),
                        map: map,
                        title: data.title
                    });

                    var infoWindow = new google.maps.InfoWindow({
                        content: data.content
                    });

                    // Add listener to show InfoWindow only if within specified radius
                    marker.addListener('click', function() {
                        var dist = getDistanceFromLatLonInM(lat, lng, data.lat, data.lng);
                        if (dist <= radius) {
                            infoWindow.open(map, marker);
                        } else {
                            console.log("Marker outside of radius");
                        }
                    });
                });
            })
            .catch(error => {
                console.error('Error fetching markers:', error);
            });
    }


    // Check if the Geolocation API is supported and try to get the user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            // User's location obtained successfully, initialize the map with the user's location
            initMap(position.coords.latitude, position.coords.longitude);
        }, function() {
            // Unable to get the user's location, initialize the map with the default location
            initMap();
        });
    } else {
        // Geolocation API not supported, initialize the map with the default location
        initMap();
    }

    // The initMap function needs to be in the global scope to be callable as the callback after the Maps API is loaded
    window.initMap = initMap;
});

// Haversine formula to calculate distance between lat-lon points
function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d * 1000; // Convert to meters
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}