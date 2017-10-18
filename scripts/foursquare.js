let items;
/**********FourSquare***************/
$.ajax({
    url:'https://api.foursquare.com/v2/venues/explore',
    method: 'GET',
    dataType: 'json',
    data: 'limit=50' +
            '&near='+ "San Francisco, CA" +
            '&client_id=FC3C2VK4UPVVYEJESMJUG0TIN2IRIF5YPU5Y1XOYXI3RMAHH' +
            '&client_secret=3MEGPSXCNYHECURVFIP5JNK1UX2E3U0N0XW3XAGKETU2I4YJ' +
            '&v=20140806' +
            '&m=foursquare' +
            '&query=coffee',
    async: true,

    success: function (data) {
        var result = data.response;
        // console.log(data.response.groups[0].items);
    }
}).then(function(result){
    console.log("This is a request")
    items = result.response.groups[0].items;

    // Activate Knockout.js
    ko.applyBindings(new viewModel());
}).then(function(items){
    initMap();
});

