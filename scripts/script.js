import LeafletMap from "./LeafletMap.js";
import ActivityDAO from "./ActivityDAO.js";

//id komt overeen met de id van het div element in html waar de map moet komen
let maps = new LeafletMap('map')
maps.initMap();

let activiteitenLijst = new ActivityDAO(maps)

const filterDateInput = document.getElementById('filterDate');

// Voeg een inputgebeurtenis toe aan het inputveld
filterDateInput.addEventListener('input', function() {
    // Zoek de ingevoerde datum op


    const selectedDate = new Date(filterDateInput.value).toLocaleString("nl-BE")

    // Roep de makeList-methode aan met de geselecteerde datum om de lijst bij te werken
    activiteitenLijst.makeList(selectedDate);
});

const filterReset = document.getElementById("filterReset");
filterReset.addEventListener('click', function (){
    filterDateInput.value =""
    activiteitenLijst.makeList()
})

document.getElementById("optionMy").addEventListener("change",function (){
    activiteitenLijst.showRegisteredEvents(true);
})
document.getElementById("optionAll").addEventListener("change",function (){
    activiteitenLijst.showRegisteredEvents(false)
})

