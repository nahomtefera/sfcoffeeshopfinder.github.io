let searchBox = document.getElementById("search-box"); // element where the user will start the search
let ulList = document.getElementById("list-ul");
let lastOpenedInfoWindow; // we use this variable as a flag to know wich marker was opened

let viewModel = function appViewModel() {
    let self = this;
    
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
        
        for(let i = 0; i < self.itemsToRender().length; i++) {
            // we will assign this values to the markers
            let currentItem = self.itemsToRender()[i];
            let currentItemName = currentItem.venue.name;
            let currentItemId = currentItem.venue.id;
            let currentItemAddress = currentItem.venue.location.address;
            let currentItemRating = currentItem.venue.rating;
            let currentIsOpen = currentItem.venue.hours.status;
            // if the value of the input matches 
            // the name of the business or the address we will show that business
            if(currentItemName.toLowerCase().indexOf(searchBox.value.toLowerCase()) != -1 || (currentItemAddress) && currentItemAddress.toLowerCase().indexOf(searchBox.value.toLowerCase()) != -1 ){
                self.listedItems.push(
                    {
                        name: ko.observable(currentItemName),
                        address: currentItemAddress,
                        id: currentItemId,
                        rating: currentItemRating,
                        time: currentIsOpen
                    }
                );
            } else {
                // if the value of the search box doesn't match 
                // the name or address of our businesses it will display 'no matches'
                noMatches++;
                
                if(noMatches === self.itemsToRender().length){
                    self.listedItems([
                        {
                            name: "No Matches"
                        }
                    ]);
                }
                
            }
        }
    };

let lastPopupWindow;

let newPopUpWindow = new google.maps.InfoWindow()
    // when a new infoWindow opens the previous one will clsoe
    this.openMarker = function() {
        if(lastPopupWindow) {
            lastPopupWindow().close();
        }

        for (let i = 0; i < markers.length; i++){
            if(this.id === markers[i].id){
                markers[i].setMap(map);
                populateInfoWindow(markers[i],  newPopUpWindow);
                lastPopupWindow = populateInfoWindow(markers[i], newPopUpWindow);
            }
        }
    }
}
