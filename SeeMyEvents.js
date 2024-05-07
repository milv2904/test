

import Activity from "./Activity.js";
import showSuccessAlert from "./showAlerts.js";
import showFailAlert from "./showAlerts.js";

let activities = []

let url = "https://65f5ba1041d90c1c5e0a0b08.mockapi.io/project/Activities"


if(sessionStorage.getItem("userID")===null){
    document.addEventListener('inlogEvent',makeActivities)
}else{
    makeActivities()
}


function makeActivities(){
    console.log("makeActivities")
    fetch(url)
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
                console.log("event: "+event.creatorID)
                if(event.creatorID == sessionStorage.getItem("userID")){
                    console.log("event toevoegen aan array")
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
                    console.log(activity)
                    activities.push(activity);
                }
            }
            makeList();
        })
}



function makeList()
{
    console.log("Maak lijst")
    const activiteitenLijst = document.getElementById('activiteitenlijst')
    const eventTemplate = document.getElementById('eventTemplate')

    activiteitenLijst.innerHTML = "";

    if (activities.length === 0) {
        let geenActiviteiten = document.createElement("h2");
        geenActiviteiten.innerText = "U hebt nog geen activiteiten aangemaakt."
        let note = document.createElement("h4")
        note.innerHTML = "Maak hier een activiteit aan: <br><a href='../HTML_CSS/CreateEvent.html'>Create Event</a>"
        activiteitenLijst.appendChild(geenActiviteiten)
        activiteitenLijst.appendChild(note)
    }

    for (let activity of activities) {
        const newEvent = eventTemplate.content.cloneNode(true);
        const eventID = activity.id;
        const headingID = `headingSubscribers_${eventID}`;
        const collapseID = `collapseSubscribers_${eventID}`;
        const removeID = `remove-${eventID}`;

        let subscribersList = newEvent.querySelector('.subscribers-list');
        subscribersList.innerHTML = '';

        if(activity.subscriberIDs.length === 0){
            let listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            let icon = document.createElement('i');
            icon.classList.add('fa-solid');
            icon.classList.add('fa-users-slash');
            listItem.appendChild(icon);
            listItem.innerHTML += " Nog geen deelnemers voor deze activiteit"
            subscribersList.appendChild(listItem);
        }
        else{
            activity.subscriberIDs.forEach(subscriberID => {
                fetch(`https://65f5ba1041d90c1c5e0a0b08.mockapi.io/project/Users/${subscriberID}`)
                    .then(response => {
                        if (!response.ok) {
                            showFailAlert("Ingeschreven leden kunnen niet worden opgehaald. Probeer het opnieuw...")
                            throw new Error('Error: fetch niet ok.');
                        }
                        return response.json();
                    })
                    .then(userData => {
                        let listItem = document.createElement('li');
                        listItem.classList.add('list-group-item');
                        let icon = document.createElement('i');
                        icon.classList.add('fa-solid');
                        icon.classList.add('fa-user');
                        listItem.appendChild(icon);
                        listItem.innerHTML += ' ' + userData.username;
                        subscribersList.appendChild(listItem);
                    })
                    .catch(error => {
                        showFailAlert("Ingeschreven leden kunnen niet worden opgehaald. Probeer het opnieuw...")
                        console.error('Error: kon niet aan de data:', error);
                    });
            })
        }

        newEvent.querySelector('.datum').textContent = activity.datum;
        newEvent.querySelector('.game').textContent = activity.game;
        newEvent.querySelector('.locatie').textContent = activity.locatie;
        newEvent.querySelector('.ingeschreven').textContent = `Aantal ingeschreven: ${activity.numberRegisteredPersons}/${activity.maxPersons}`;
        newEvent.querySelector('.info').textContent = activity.info;

        newEvent.querySelector('.accordion').id = `accordion-${eventID}`;
        newEvent.querySelector('.accordion-button').setAttribute('data-bs-target', `#collapseSubscribers-${eventID}`);
        newEvent.querySelector('.accordion-collapse').id = `collapseSubscribers-${eventID}`;
        newEvent.querySelector('.remove').id = `remove-${eventID}`;

        newEvent.querySelector('.accordion-header').id = headingID;
        newEvent.querySelector('.accordion-button').setAttribute('data-bs-target', `#${collapseID}`);
        newEvent.querySelector('.accordion-collapse').id = collapseID;
        newEvent.querySelector('.remove').id = removeID;
        newEvent.querySelector('.accordion-collapse').setAttribute('aria-labelledby', headingID);

        let removeButton = newEvent.querySelector(`#remove-${eventID}`);
        removeButton.addEventListener('click', function() {
            console.log("remove activity " + eventID);
            verwijderActiviteit(eventID);
        });
        activiteitenLijst.appendChild(newEvent);
    }
}

function verwijderActiviteit(id) {
    let modal2 = document.getElementById("bevestigingModal");
    modal2.style.display = "block";

    let knopJa = document.getElementById("confirmButton");
    let knopNee = document.getElementById("cancelButton");

    // Voeg eventlistener toe aan de knoppen
    knopJa.addEventListener("click", handleConfirm);
    knopNee.addEventListener("click", handleCancel);

    function handleConfirm() {
        // Verwijder eventlisteners om te voorkomen dat ze meerdere keren worden uitgevoerd
        knopJa.removeEventListener("click", handleConfirm);
        knopNee.removeEventListener("click", handleCancel);
        modal2.style.display = "none";
        fetch(url + '/' + id, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    showFailAlert("Er was een error tijdens het verwijder proces, probeer later opnieuw.")
                    throw new Error('Het verwijderen is mislukt...');
                }
                activities = activities.filter(activity => activity.id !== id);
                makeList();
                showSuccessAlert("Verwijderen is gelukt!");
            })
            .catch(error => {
                console.error('Error verwijderen activiteit:', error);
                // Show an error message
                showFailAlert("Er was een error tijdens het verwijder proces, probeer later opnieuw.");
            });


    }

    function handleCancel() {
        // Verwijder eventlisteners om te voorkomen dat ze meerdere keren worden uitgevoerd
        knopJa.removeEventListener("click", handleConfirm);
        knopNee.removeEventListener("click", handleCancel);

        modal2.style.display = "none";
    }


}