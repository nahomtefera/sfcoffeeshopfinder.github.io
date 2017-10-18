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
let map, markers = [], polygon = null;
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
    let locations = [
        {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
        {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
        {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
        {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
        {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
        {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
    ];
    // console.log(locations);
    console.log(items)
    
    // 5. Create a variable that will be the popout info window
    let popupInfoWindow = new google.maps.InfoWindow();
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
        address = items[i].venue.location.address
        // create a new marker per each location
        marker = new google.maps.Marker({
            position: position,
            title: title,
            address:address,
            animation: google.maps.Animation.DROP,
            id: id
        });
        // push every marker to an array
        markers.push(marker);
        // create and event listener to open an info window on click
        marker.addListener('click', function(){
            if(lastPopupInfoWindow){
                lastPopupInfoWindow().close();
            }
            if(newPopUpWindow){
                lastPopupWindow().close();
            }
            populateInfoWindow(this, popupInfoWindow)
            lastPopupInfoWindow = populateInfoWindow(this, popupInfoWindow);
        });
    }
    //
    // 11. We are also going to create a functino to draw in our map `drawingManager()`
    //
    // Initialize the drawing manager
    let drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_LEFT,
            drawingModes: [
                google.maps.drawing.OverlayType.POLYGON
            ]
        }
    });

    // 7. Now we will add another event listener to the button `show-marker` and `hide-marker`
    document.getElementById("show-markers").addEventListener('click', showMarkers);
    document.getElementById("hide-markers").addEventListener('click', hideMarkers);
    document.getElementById('toggle-drawing').addEventListener('click', function() {
        toggleDrawing(drawingManager);
      });

    // 11. iii. Add event listener to show markers inside the plygon once it's complete
    drawingManager.addListener("overlaycomplete", function(event){
        // remove polygon if there is already one
        if(polygon) {
            polygon.setMap(null);
            hideMarkers();
        }
        // deactivate drawing mode
        drawingManager.setDrawingMode(null);

        // Create a new editable polygon
        polygon = event.overlay;
        polygon.setEditable(true);
        // Searching within the polygon.
        searchWithinPolygon();
        // Make sure the search is re-done if the poly is changed.
        polygon.getPath().addListener('set_at', searchWithinPolygon);
        polygon.getPath().addListener('insert_at', searchWithinPolygon);
    });
    
}
// 8. Create the function that will create the infoWindow
function populateInfoWindow(marker, infoWindow){
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
        // 10. We will also create a function to pop up Street Viw imagery, `getStreetView()`
        //
        function getStreetView(data, status){
            if(status == google.maps.StreetViewStatus.OK) {
                let nearStreetViewLocation = data.location.latLng;
                let heading = google.maps.geometry.spherical.computeHeading(
                    nearStreetViewLocation, marker.position);

                infoWindow.setContent('<div class="marker-title">' + marker.title + 
                    "<br/>"+ marker.address + "<br/>" + 
                    "<br/>" + '</div><div id="pano"></div>'
                );
                
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
        }
        // We will use  StreetView service to get the closest streetView image
        // within 50m of the location
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);

        // Open InfoWindow in the correct marker
        infoWindow.open(map, marker);
    }
};
// 9. Create the functions that will display and hide the infoWindow
// This function will loop through every marker and display them all
function showMarkers(){
    var bounds = new google.maps.LatLngBounds();
    
    for (let i = 0; i < markers.length; i++){
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);    
};

function hideMarkers(){
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
};

// Function to toggle Drawing functionality
function toggleDrawing(drawingManager){
    if (drawingManager.map) {
        console.log(drawingManager.map)
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
