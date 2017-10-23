/*
* 1. Create map and markers variables
* 2. Initialize the map with function initMap()
* 3. Variable map will call the map function and assign the start of the map
* 4. Create the variable locations and push the location that are going to be rendered.
* 5. Create a variable that will be the popout info window
* 6. Now we will create a new array inside a for loopand we will push inside the locations we want to render with markers
*   i. Create a new variable marker and loop through every location
*   ii. Everytime a marker is created we will push it to markers array
*   iii. create and event listener to open an info window on click
* 7. Now we will add another event listener to the button `show-marker` and `hide-marker`
* 8. Create the function that will create the infoWindow
* 9. Create the functions that will show and hide the infoWindows
* ** We can also create an array wit sytles to change how our map looks
* 10. We will also create a function to pop up Street Viw imagery, `getStreetView()`
* 11. We are also going to create a functino to draw in our map `drawingManager()`
*    i. We will create a button `toogle-drawing` to toggle the drawing functionality
*    ii. We will also create the function `toggleDrawing` to activate the functionality
*    iii. Add event listener to show markers inside the plygon once it's complete
*/

//GLOBAL variables `map`, `polygon` and `markers` 
var map, markers = [], polygon = null, lastMarker;

function googleError(){
    alert("There is an error with the Google Maps request");
}

function initMap(){
    let style = [
        {
            "featureType": "landscape",
            "stylers": [
                {
                    "hue": "#F1FF00"
                },
                {
                    "saturation": -27.4
                },
                {
                    "lightness": 9.4
                },
                {
                    "gamma": 1
                }
            ]
        },
        {
            "featureType": "road.highway",
            "stylers": [
                {
                    "hue": "#0099FF"
                },
                {
                    "saturation": -20
                },
                {
                    "lightness": 36.4
                },
                {
                    "gamma": 1
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "stylers": [
                {
                    "hue": "#00FF4F"
                },
                {
                    "saturation": 0
                },
                {
                    "lightness": 0
                },
                {
                    "gamma": 1
                }
            ]
        },
        {
            "featureType": "road.local",
            "stylers": [
                {
                    "hue": "#FFB300"
                },
                {
                    "saturation": -38
                },
                {
                    "lightness": 11.2
                },
                {
                    "gamma": 1
                }
            ]
        },
        {
            "featureType": "water",
            "stylers": [
                {
                    "hue": "#00B6FF"
                },
                {
                    "saturation": 4.2
                },
                {
                    "lightness": -63.4
                },
                {
                    "gamma": 1
                }
            ]
        },
        {
            "featureType": "poi",
            "stylers": [
                {
                    "hue": "#9FFF00"
                },
                {
                    "saturation": 0
                },
                {
                    "lightness": 0
                },
                {
                    "gamma": 1
                }
            ]
        }
    ];
    // 1. First we initialize the map in the div assigned to the map
    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 37.7449, lng: -122.4194},
        zoom: 12,
        styles: style,
        mapTypeControl: false
    });

    // 4. Create the variable locations and push the location that are going to be rendered.    
    // 5. Create a variable that will be the popout info window
    let popupInfoWindow;
    let lastPopupInfoWindow;

    // 6. Now we will create a new array inside a for loopand we will push inside the locations we want to render with markers
    for (let i = 0; i < items.length; i++){
        let marker, position, title, id, address;
        // Get position and title for each location
        position = {
            lat: items[i].venue.location.lat,
            lng: items[i].venue.location.lng
        };
        title = items[i].venue.name;
        id = items[i].venue.id;
        address = items[i].venue.location.address;
        // create a new marker per each location
        marker = new google.maps.Marker({
            position: position,
            title: title,
            address:address,
            animation: google.maps.Animation.DROP,
            id: id,
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        });
        // push every marker to an array
        markers.push(marker);
        // create and event listener to open an info window on click
        marker.addListener('click', createMarkerPopup);
    }

    function createMarkerPopup(){      
        // the marker will first bounce
        this.setAnimation(google.maps.Animation.BOUNCE);
        stopMarkerAnimation(this, 2000);
        // create the infowindow
        populateInfoWindow(this);
    }
    initializeMarkers();
}
// 8. Create the function that will create the infoWindow
let getStreetView = function(){};

function populateInfoWindow(marker){
    
    // Close previous popup
    if(lastPopupWindow){
        lastPopupWindow.close();
    }
    
    infoWindow = new google.maps.InfoWindow();
    
    // Check to make sure the infowindow is not already opened on this marker.
    if (infoWindow.marker != marker) {
        infoWindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infoWindow.addListener('closeclick', function() {
            infoWindow.marker = null;
        });
        // We are going to request a street view image to add it to the InfoWindow
        let streetViewService = new google.maps.StreetViewService();
        let radius = 50;
        //
        // 10. We will also create a function to pop up Street Viw imagery, `getStreetView`
        //
        getStreetView = function(data, status){
            if(status == google.maps.StreetViewStatus.OK) {
                let nearStreetViewLocation = data.location.latLng;
                let heading = google.maps.geometry.spherical.computeHeading(
                    nearStreetViewLocation, marker.position);
                // add a div with the name and address in the infoWindow
                infoWindow.setContent('<div class="marker-title">' + marker.title + 
                    "<br/>" + "</div>" + "<div class='marker-address'>" + 
                    marker.address + "</div>" + '</div><div id="pano"></div>'
                );
                // 
                let panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 30
                    }                    
                };
                let panorama = new google.maps.StreetViewPanorama(document.getElementById("pano"), panoramaOptions);
                } else {
                    infoWindow.setContent('<div>' + marker.title + "<br/>" + "<br/>" + ' No StreetView Found</div>');
                }
        };
        // We will use  StreetView service to get the closest streetView image
        // within 50m of the location
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);

        // Open InfoWindow in the correct marker
        lastPopupWindow = infoWindow;
        infoWindow.open(map, marker);
    }
    lastMarker = marker;
    
}
// 9. Create the functions that will display and hide the infoWindow
// This function will loop through every marker and display them all
function initializeMarkers(){
    var bounds = new google.maps.LatLngBounds();
    
    for (let i = 0; i < markers.length; i++){
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);    
}
// Function to toggle Drawing functionality
function toggleDrawing(drawingManager){
    if (drawingManager.map) {
        drawingManager.setMap(null);
        // In case the user drew anything, get rid of the polygon
        if (polygon !== null) {
          polygon.setMap(null);
        }
      } else {
        drawingManager.setMap(map);
    }
}

// This function hides all markers outside the polygon,
// and shows only the ones within it. This is so that the
// user can specify an exact area of search.
function searchWithinPolygon() {
    for (var i = 0; i < markers.length; i++) {
        if (google.maps.geometry.poly.containsLocation(markers[i].position, polygon)) {
        markers[i].setMap(map);
        } else {
        markers[i].setMap(null);
        }
    }
}

function stopMarkerAnimation(marker, timeout) {
    window.setTimeout(function () {
        marker.setAnimation(null);        
    }, timeout);
}

