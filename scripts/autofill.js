import showSuccessAlert from "./showAlerts.js";
import showFailAlert from "./showAlerts.js";

let adres
let longitude
let latitude





new Autocomplete("location", {
    selectFirst: true,
    insertToInput: true,
    cache: true,
    howManyCharacters: 2,
    // onSearch
    onSearch: ({ currentValue }) => {
        // api
        const api = `https://nominatim.openstreetmap.org/search?format=geojson&limit=5&street=${encodeURI(
            currentValue
        )}`;

        return new Promise((resolve) => {
            fetch(api)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data.features);
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    },

    //weergeven van alle resultaten
    onResults: ({ currentValue, matches, template }) => {
        const regex = new RegExp(currentValue, "gi");

        // if the result returns 0 we
        // show the no results element
        return matches === 0
            ? template
            : matches
                .map((element) => {
                    return `
          <li class="loupe">
            <p>
              ${element.properties.display_name.replace(
                        regex,
                        (str) => `<b>${str}</b>`
                    )}
            </p>
          </li> `;
                })
                .join("");
    },

    //ophalen info geselecteerd adres + marker toevoegen
    onSubmit: ({ object }) => {
        const {display_name} = object.properties;
        adres = display_name;
        const [lng, lat] = object.geometry.coordinates;
        latitude = lat;
        longitude = lng;

    },

    //Indien geen geldig adres gevonden
    noResults: ({ currentValue, template }) =>
        template(`<li class="no-results">No results found: "${currentValue}"</li>`),
});
let form = document.getElementById("form");
form.onsubmit = sendData;

function sendData(event) {
    event.preventDefault();
    let coords = [Number(latitude),Number(longitude)]
    let name = document.getElementById("fullName").value
    let game = document.getElementById("game").value
    let maxPlayers = document.getElementById("maxPlayers").value
    let dateTime = document.getElementById("dateTime").value
    let adress = document.getElementById("location").value
    let extraInfo = document.getElementById("extraInfo").value

    if(new Date(dateTime) < new Date()){
        document.getElementById("error-message").style.display = "inline"
    }
    else{
        // Replace 'YOUR_MOCK_API_URL' with the URL of your mock API
        const url = 'https://65f5ba1041d90c1c5e0a0b08.mockapi.io/project/Activities';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "coordinates" : coords,
                "name" : name,
                "date" : dateTime,
                "game" : game,
                "locatie" : adress,
                "maxSpelers" : Number(maxPlayers),
                "info": extraInfo,
                "ingeschreven": 0,
                "creatorID":Number(sessionStorage.getItem("userID"))
            }),
        })
            .then(response => {
                if (!response.ok) {
                    showFailAlert("Activiteit aanmaken is niet gelukt! Probeer opnieuw...")
                    throw new Error('Network response was not ok');
                }
            })
            .then(data => {
                // Handle successful response here
                console.log('Success:', data);
                showSuccessAlert("Uw activiteit werd succesvol aangemaakt");
                document.getElementById("form").reset();
                //submit clearen nog
            })
            .catch(error => {
                // Handle error here
                console.error('Error:', error);
                // Optionally display an error message to the user
                showFailAlert("Activiteit aanmaken is niet gelukt! Probeer opnieuw...");
            });
    }




}





