let allBusinesses = ['The great Pizza', 'Five Guys', 'Nick the Greek', 'Abesha Restaurant', 'Amigo Mio' ];
let searchBox = document.getElementById("search-box");
let ulList = document.getElementById("list-ul");
let lastOpenedInfoWindow;

let viewModel = function appViewModel() {
    console.log("Hey I'm inside viewModel");
    let self = this;
    console.log(items);
    
    this.businessToRender = ko.observableArray();
    this.itemsToRender = ko.observableArray();
    
    for(let i = 0; i < allBusinesses.length; i++){
        self.businessToRender().push(allBusinesses[i]);
    }
    // With items from foursquare
    for(let i = 0; i < items.length; i++){
        self.itemsToRender().push(items[i]);
    } 
    console.log("items to render: ", self.itemsToRender());
    this.listedBusiness = ko.observableArray([
    ]);

    this.listedItems =  ko.observableArray([]);

    
    this.filter = function(){
        // self.listedBusiness([]);
        self.listedItems([]);
        let noMatches = 0;
        
        for(let i = 0; i < self.itemsToRender().length; i++) {
            let currentItem = self.itemsToRender()[i];
            let currentItemName = currentItem.venue.name;
            let currentItemId = currentItem.venue.id;
            let currentItemAddress = currentItem.venue.location.address;
            let currentItemRating = currentItem.venue.rating;
            let currentIsOpen = currentItem.venue.hours.status;
            
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
                
                noMatches++;
                
                if(noMatches === self.itemsToRender().length){
                    self.listedItems([
                        {
                            name: "No Matches"
                        }
                    ]);
                }
                
            }
            console.log(self.listedItems);
        }
    };

let lastPopupWindow;
let newPopUpWindow = new google.maps.InfoWindow()

    this.openMarker = function() {
        // console.log();
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
    
    console.log(this.businessToRender());
}
