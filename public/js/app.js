document.addEventListener('DOMContentLoaded', function() {
    var defaultLat = 42.3831149; // Default Latitude
    var defaultLng = -72.5304404; // Default Longitude
    var radius = 50; // Radius in meters (adjustable)

    function initMap(lat = defaultLat, lng = defaultLng) {
        var mapOptions = {
            center: new google.maps.LatLng(lat, lng),
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

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

        fetch('data/markers.json')
            .then(response => response.json())
            .then(markersData => {
                markersData.forEach(function(data) {
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(data.lat, data.lng),
                        map: map,
                        title: data.title
                    });

                    marker.addListener('click', function() {
                        var dist = getDistanceFromLatLonInM(lat, lng, data.lat, data.lng);
                        var detailsDiv = document.getElementById('marker-details');
                        detailsDiv.innerHTML = `<div class="content-locked"><h3>${data.title}</h3><p>${data.content_locked}</p></div>`;
                        if (dist <= radius) {
                            detailsDiv.innerHTML += `
                                <div class="content-unlocked">
                                    <p>${data.content_unlocked}</p>
                                    <div class="vote-section">
                                    <button class="btn btn-success upvote">Upvote</button>
                                    <span class="votes-count">0</span>
                                    <button class="btn btn-danger downvote">Downvote</button>
                                </div>
                                    <div class="comments-section">
                                        <h4>Comments</h4>
                                        <textarea placeholder="Add a comment..." rows="3" class="form-control"></textarea>
                                        <button class="btn btn-primary mt-2">Submit Comment</button>
                                    </div>
                                </div>`;
                            let unlockedContent = detailsDiv.querySelector('.content-unlocked');
                            setTimeout(() => {
                                unlockedContent.style.display = 'block';
                                unlockedContent.style.opacity = 1;
                            }, 100); // Timeout to trigger fade-in effect

                            let upvoteBtn = detailsDiv.querySelector('.upvote');
                            let downvoteBtn = detailsDiv.querySelector('.downvote');
                            let votesCount = detailsDiv.querySelector('.votes-count');
                            upvoteBtn.addEventListener('click', () => {
                                votesCount.textContent = parseInt(votesCount.textContent) + 1;
                            });
                            downvoteBtn.addEventListener('click', () => {
                                votesCount.textContent = parseInt(votesCount.textContent) - 1;
                            });
                        }
                    });
                });
            })
            .catch(error => {
                console.error('Error fetching markers:', error);
            });
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            initMap(position.coords.latitude, position.coords.longitude);
        }, function() {
            initMap(); // Fallback to default location
        });
    } else {
        initMap(); // Geolocation API not supported, use default location
    }

    window.initMap = initMap;
});

function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // Convert degrees to radians
    var dLon = deg2rad(lon2 - lon1); // Convert degrees to radians
    var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = R * c; // Distance in km
    return distance * 1000; // Convert distance to meters
}


function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
