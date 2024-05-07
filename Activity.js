//Activiteiten aanmaken

import showSuccessAlert from "./showAlerts.js";
import showFailAlert from "./showAlerts.js";
export default class Activity{
    url = "https://65f5ba1041d90c1c5e0a0b08.mockapi.io/project/Activities/"
    constructor(id, coords, naam, datum, maxPersons, numberRegisteredPersons, game, locatie, info, creatorID, subscriberIDs) {
        this.id = id;
        this.coords = coords
        this.naam = naam
        this.datum = new Date(datum).toLocaleString("nl-BE")
        this.maxPersons = maxPersons
        this.numberRegisteredPersons = numberRegisteredPersons
        this.game = game;
        this.locatie = locatie;
        this.info = info;
        this.creatorID = creatorID;
        this.subscriberIDs = subscriberIDs
    }

    //inschrijven op activiteit
    Register(callback) {
        let modal2 = document.getElementById("bevestigingModal");
        modal2.style.display = "block";

        let knopJa = document.getElementById("confirmButton");
        let knopNee = document.getElementById("cancelButton");

        // Voeg eventlistener toe aan de knoppen
        knopJa.addEventListener("click", handleConfirm);
        knopNee.addEventListener("click", handleCancel);
        let dit = this
        function handleConfirm() {
            // Verwijder eventlisteners om te voorkomen dat ze meerdere keren worden uitgevoerd
            knopJa.removeEventListener("click", handleConfirm);
            knopNee.removeEventListener("click", handleCancel);

            dit.numberRegisteredPersons += 1;
            dit.subscriberIDs.push(sessionStorage.getItem("userID"))
            modal2.style.display = "none";
            dit.update(dit.numberRegisteredPersons,dit.subscriberIDs);

            // Voer de callback-functie uit nadat het modale venster is gesloten
            if (callback) {
                callback();
            }
        }

        function handleCancel() {
            // Verwijder eventlisteners om te voorkomen dat ze meerdere keren worden uitgevoerd
            knopJa.removeEventListener("click", handleConfirm);
            knopNee.removeEventListener("click", handleCancel);

            modal2.style.display = "none";
        }
    }

    //aantal ingeschreven personen updaten in mockAPI
    update = (ingeschreven,subscriberIDs) =>{
        console.log("update")
        fetch(this.url + this.id,{
            method: 'put',
            headers: {"content-type": "application/json"},
            body: JSON.stringify({"ingeschreven": ingeschreven, "subscriberIDs": subscriberIDs})
        }).then(()=>{
            showSuccessAlert("U bent succesvol ingeschreven.");
            document.getElementById(`ingeschrevenText-${this.id}`).hidden = false;
            document.getElementById(`button-${this.id}`).hidden = true;
        })
            .catch(()=>showFailAlert("inschrijven op activiteit niet gelukt"))
    }

    //controleren of activiteit volzet is
    IsFull(){
        if(this.numberRegisteredPersons >= this.maxPersons){
            return true
        }
        return false
    }

}