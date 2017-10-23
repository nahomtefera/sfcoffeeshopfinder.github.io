let lastOpenedInfoWindow; // we use this variable as a flag to know wich marker was opened
let lastPopupWindow;
// let searchboxtest = ko.observable();

let ViewModel = function appViewModel() {
    let self = this;
    
    this.searchboxtest = ko.observable();

    this.itemsToRender = ko.observableArray();
    
  
    // Push the items that we get from foursquare
    for(let i = 0; i < items.length; i++){
        self.itemsToRender().push(items[i]);
    } 

    this.listedItems =  ko.observableArray([]);

    
    this.filter = function(){
        // self.listedItems([]);
        self.listedItems([]);
        let noMatches = 0;

        //Close any popup window that might be open
        if(lastPopupWindow){
            lastPopupWindow.close();
        }


        for(let i = 0; i < self.itemsToRender().length; i++) {
            // we will assign this values to the markers
            let currentItem = self.itemsToRender()[i];
            let currentItemName = currentItem.venue.name;
            let currentItemId = currentItem.venue.id;
            let currentItemAddress = currentItem.venue.location.address;
            let currentItemRating = currentItem.venue.rating;
            let currentIsOpen = currentItem.venue.hours.status;
            let inputedText = self.searchboxtest();

            //at the beginning inputText is undefined
            if(typeof(inputedText) == "undefined"){
                // we want to show the markers and list when the page loads
                self.listedItems.push(
                    {
                        name: ko.observable(currentItemName),
                        address: currentItemAddress,
                        id: currentItemId,
                        rating: currentItemRating,
                        time: currentIsOpen,
                    }
                );
                // this will show all the markers
                if(typeof markers !== "undefined" && typeof markers[i] !== "undefined"){
                    markers[i].setVisible(true);
                }
                
                // once we click in the text input field it won't have a value of undefined anymore
            } else if(typeof(inputedText) !== "undefined"){
                // this will push the markers that match the input test to a variable
                // and from that variable it will be pushed to the list 
                if(currentItemName.toLowerCase().indexOf(inputedText.toLowerCase()) != -1 || (currentItemAddress) && currentItemAddress.toLowerCase().indexOf(inputedText.toLowerCase()) != -1 ){
                    self.listedItems.push(
                        {
                            name: ko.observable(currentItemName),
                            address: currentItemAddress,
                            id: currentItemId,
                            rating: currentItemRating,
                            time: currentIsOpen,
                        }
                    );
                    // this will show the markers that match the input
                    if(typeof markers[i] !== "undefined"){
                        markers[i].setVisible(true);
                    }
                } else {
                        // this will hide the markers that don't match with the search input
                    markers[i].setVisible(false);
                    // if the value of the search box doesn't match 
                    // the name or address of our businesses it will display 'no matches'
                    noMatches++;
                    
                    
                    if(noMatches === self.itemsToRender().length){
                        self.listedItems([
                            {
                                name: "",
                                address: "",
                                id: "",
                                rating: "",
                                time: ""
                            }
                        ]);
                    }
                }
            }
        }
    };

    let newPopUpWindow;

    // when a new infoWindow opens the previous one will clsoe
    this.openMarker = function() {
        if(lastPopupWindow){
            lastPopupWindow.close();
        }
        for (let i = 0; i < markers.length; i++){            
            if(this.id === markers[i].id){
                markers[i].setVisible(true);
                // animation to make the marker bounce when we click in he list
                markers[i].setAnimation(google.maps.Animation.BOUNCE);
                stopMarkerAnimation(markers[i], 2000);
                populateInfoWindow(markers[i]);
            }
        }
    }

    this.showMarkers = function(){
        var bounds = new google.maps.LatLngBounds();
        
        for (let i = 0; i < markers.length; i++){
            markers[i].setVisible(true);
            bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);    
    }
    
    this.hideMarkers = function(){
        if(lastPopupWindow){
            lastPopupWindow.close();
        }
        for (var i = 0; i < markers.length; i++) {
            markers[i].setVisible(false);
          }
    }
    

}
