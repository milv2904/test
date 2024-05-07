import Activity from "./Activity.js";
import {showFailAlert} from "./showAlerts.js";

//Beheren van activiteiten + weergave in lijst
export default class ActivityDAO{
    url = "https://65f5ba1041d90c1c5e0a0b08.mockapi.io/project/Activities"
    MyEventsSelected = false

    constructor(maps) {
        this.maps = maps ;      //om de aangemaakte map te kunnen gebruiken binnen deze klasse
        this.activities = [];
        this.filteredActivities = [];
        this.markers = [];
        this.markerCluster = new L.markerClusterGroup({showCoverageOnHover: true});
        console.log(sessionStorage.getItem("userID"))
        if(sessionStorage.getItem("userID")===null){
            document.addEventListener('inlogEvent', () => {this.makeActivities()})
        }else{
            this.makeActivities()
        }
    }


    showRegisteredEvents(selected){
        console.log("seeRegistered")
        this.MyEventsSelected = selected;
        this.makeList();
    }
    //Data ophalen van mockAPI en activiteiten aanmaken
    makeActivities(){
        console.log("makeActivities")
        fetch(this.url)
            .then(response => {
                // Controleer of het verzoek succesvol was
                if (!response.ok) {
                    showFailAlert("Laden van activiteiten niet gelukt. Herlaad de pagina!")
                    throw new Error('Network response was not ok');
                }
                // Als het verzoek succesvol was, converteer de response naar JSON
                return response.json();
            })
            .then(data => {
                for(let event of data){
                    let id = event.id;
                    let coords = event.coordinates;
                    let name = event.name;
                    let datum = event.date;
                    let game = event.game;
                    let locatie = event.locatie;
                    let maxSpelers = event.maxSpelers;
                    let ingeschreven = event.ingeschreven;
                    let info = event.info
                    let creatorID = event.creatorID;
                    let subscriberIDs = event.subscriberIDs;
                    let activity = new Activity(id,coords,name,datum,maxSpelers,ingeschreven, game, locatie, info, creatorID, subscriberIDs);
                    this.activities.push(activity);
                }
                this.makeList()
                this.setMarkers()

            })
    }


    //activiteiten weergeven in een lijst op webpagina
    //Hiervoor wordt de template 'eventTemplate' gebruikt
    makeList(selectedDate) {
        console.log("Maak lijst")
        const activiteitenLijst = document.getElementById('activiteitenlijst')
        const eventTemplate = document.getElementById('eventTemplate')

        this.filteredActivities = this.activities

        if(this.MyEventsSelected === true){
            this.filteredActivities = this.filteredActivities.filter(activity => {
                return activity.subscriberIDs.includes(sessionStorage.getItem("userID"))
            })
        }

        if (selectedDate !== undefined) {
            this.filteredActivities = this.filteredActivities.filter(activity => {
                return activity.datum.split(" ")[0] === selectedDate.split(" ")[0]
            });

        }
        activiteitenLijst.innerHTML = ""

        if (this.filteredActivities.length === 0) {
            let geenActiviteiten = document.createElement("h2");
            geenActiviteiten.innerText = "Er zijn geen activiteiten"
            let note = document.createElement("h4")
            note.innerHTML = "U kunt zelf een event maken:<br><a href='createEvent.html'>Create Event</a><br><br>of inschrijven op bestaand event."
            activiteitenLijst.appendChild(geenActiviteiten)
            activiteitenLijst.appendChild(note)
        }
        for (let activity of this.filteredActivities) {
            const newEvent = eventTemplate.content.cloneNode(true);
            newEvent.querySelector('.event').id = `event-${activity.id}`;
            newEvent.querySelector('.name').textContent = activity.naam;
            newEvent.querySelector('.datum').textContent = activity.datum;
            newEvent.querySelector('.game').textContent = activity.game;
            newEvent.querySelector('.locatie').textContent = activity.locatie

            newEvent.querySelector('.ingeschreven').textContent = `Aantal ingeschreven: ${activity.numberRegisteredPersons}/${activity.maxPersons}`;
            newEvent.querySelector('.info').textContent = activity.info
            newEvent.querySelector('.ingeschreven').id = `ingeschrevenAantal-${activity.id}`;
            newEvent.querySelector('.schrijf-in').id = `button-${activity.id}`;
            newEvent.querySelector('.ingeschrevenText').id = `ingeschrevenText-${activity.id}`;
            let inschrijfButton = newEvent.getElementById(`button-${activity.id}`)
            if (activity.subscriberIDs.includes(sessionStorage.getItem("userID")) || activity.creatorID == sessionStorage.getItem("userID")) {
                inschrijfButton.style.display = "none";
                if(activity.creatorID == sessionStorage.getItem("userID")){
                    newEvent.getElementById(`ingeschrevenText-${activity.id}`).innerText = "Dit is uw activiteit!"
                }
                newEvent.getElementById(`ingeschrevenText-${activity.id}`).hidden = false;
            } else if (activity.IsFull()) {
                inschrijfButton.disabled = true;
            }
            inschrijfButton.addEventListener('click', function() {
                activity.Register(() => {
                    // Code die moet worden uitgevoerd nadat het modale venster is gesloten

                    document.getElementById(`ingeschrevenAantal-${activity.id}`).textContent = `Aantal ingeschreven: ${activity.numberRegisteredPersons}/${activity.maxPersons}`;
                    if (activity.IsFull()) {
                        inschrijfButton.disabled = true;
                    }
                });

            })
            newEvent.querySelector('.show-location').id = `butloc-${activity.id}`;
            newEvent.getElementById(`butloc-${activity.id}`).addEventListener('click', () => this.showOnMap(activity))

            activiteitenLijst.appendChild(newEvent);
        }



    }

    //activiteiten weergeven op de map

    setMarkers(){
        console.log("set Markers")

        for(let activity of this.activities){
            let beschrijving =
                "<strong>\Organisator: \</strong>" + activity.naam +
                "<br><strong>\Datum + Tijdstip: \</strong>" + activity.datum +
                "<br><strong>\Game: \</strong>" + activity.game +
                "<br><strong>\Extra info: \</strong>" + activity.info ;

            const marker = L.marker([activity.coords[0],activity.coords[1]],{id: activity.id}).bindPopup(beschrijving);
            marker.on('click',()=>{
                this.toonEvent(activity.id)
            })
            this.markers.push(marker)
            this.markerCluster.addLayer(marker);
        }
        this.maps.addCluster(this.markerCluster)
    }




    //activiteit met id markeren in lijst van activiteiten
    toonEvent(id){

        if(document.getElementById(`event-${id}`) === null){
            this.makeList()
            document.getElementById("filterDate").value = ""
        }
        var eventToHighlight = document.getElementById(`event-${id}`);
        eventToHighlight.classList.add("highlight");

        //Activiteit zichtbaar maken in scrollablelijst
        var offsetTop = eventToHighlight.offsetTop;
        var listHeight = document.getElementById("activiteitenlijst").offsetHeight;
        var scrollTop = offsetTop - (listHeight / 2);

        document.getElementById("activiteitenlijst").scrollTop = scrollTop;
        setTimeout(function (){
            eventToHighlight.classList.remove('highlight');
        },3000);
    }

    //Activiteit weergeven op de map
    showOnMap(activity) {
        this.maps.showLocation(activity.coords)
        //Open de popup van de marker horend bij activity
        this.markers.forEach(function (marker){
            var markerId = marker.options.id;
            if(markerId === activity.id){
                marker.openPopup();
            }
        })
    }


}

