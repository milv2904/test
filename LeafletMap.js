//Klasse LeafletMap wordt gebruikt voor het weergeven van de kaart op de webpagina.
//Hiervoor wordt gebruik gemaakt van Leaflet en Openstreetmap

export default class LeafletMap{
    constructor(id) {
        this.id = id;
        this.maps = null
    }

    //map aanmaken
    initMap(){
        this.maps = L.map(this.id, {
            center: [51.0467,3.7275],
            zoom: 13.5,
            attributionControl: false
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            minZoom: 3,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.maps);


        L.control.attribution({position: 'bottomright'}).addTo(this.maps)

    }


    //toevoegen clusters van markers aan de map
    addCluster(object){
        this.maps.addLayer(object)
    }

    //Locatie (coords) tonen op de map
    showLocation(coords){
        this.maps.setView(coords,25)
    }

}

