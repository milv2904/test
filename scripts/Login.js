import {showFailAlert} from "./showAlerts.js";


var modal = document.getElementById("myModal");
//var openModalBtn = document.getElementById("openModalBtn");
var closeBtn = document.getElementsByClassName("close")[0];
var loginForm = document.getElementById("loginForm")
loginForm.addEventListener('submit',login)
var yourLoginId;
var inloggegevens = [];
var userInfo = document.getElementById('userInfo');
document.getElementById('userIcon').addEventListener('click', function() {

    document.getElementById("gebruiker").innerText = "User: " + sessionStorage.getItem("username")
    if (userInfo.style.display === 'none') {
        userInfo.style.display = 'block';
    } else {
        userInfo.style.display = 'none';
    }
});
document.getElementById("logoutBtn").addEventListener("click",function (){

    sessionStorage.clear()
    document.getElementById('username').value = ""
    document.getElementById('password').value = ""
    document.getElementsByClassName("wrongLogin")[0].style.display = "none"
    userInfo.style.display = 'none';
})

fetch("https://65f5ba1041d90c1c5e0a0b08.mockapi.io/project/Users")
    .then(response => {
        if(!response.ok){
            showFailAlert("inlog gegevens kunnen niet worden opgehaald. Probeer later opnieuw!")
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        inloggegevens = data
    })



checkLoginStatus()
function checkLoginStatus() {
    // Haal de gebruikersnaam en het wachtwoord op uit de sessionStorage
    const storedUsername = sessionStorage.getItem('username');
    const storedPassword = sessionStorage.getItem('password');

    // Controleer of zowel de gebruikersnaam als het wachtwoord zijn opgeslagen
    if (storedUsername && storedPassword) {
        // Inloggegevens zijn opgeslagen, voer hier de logica uit die je wilt uitvoeren
        console.log('Inloggegevens gevonden:', storedUsername, storedPassword);

        // Je kunt hier bijvoorbeeld doorgaan met het inlogproces of andere acties uitvoeren
    } else {
        // Inloggegevens zijn niet opgeslagen, voer hier de logica uit voor het geval er geen inloggegevens zijn gevonden
        console.log('Geen inloggegevens gevonden');
        modal.style.display = "block"
        // Je kunt hier bijvoorbeeld doorsturen naar de inlogpagina of andere acties uitvoeren
    }
}

function login(event){
    event.preventDefault()
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    if(username === "" || password === ""){
        alert("Inloggen verplicht!!")
    }
    else{
        inloggegevens.forEach(login => {
            if(login.username === username && login.password === password){
                yourLoginId = login.id
                sessionStorage.setItem("username",login.username)
                sessionStorage.setItem("password",login.password)
                sessionStorage.setItem("userID",login.id)
                var inlogEvent = new Event('inlogEvent');
                document.dispatchEvent(inlogEvent);
                modal.style.display = "none"

            }
            else{
                document.getElementsByClassName("wrongLogin")[0].style.display = "inline-block";
            }
        })


    }

}



const passwordField = document.getElementById("password");
const togglePassword = document.querySelector(".password-toggle-icon i");

togglePassword.addEventListener("click", function () {
    if (passwordField.type === "password") {
        passwordField.type = "text";
        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash");
    } else {
        passwordField.type = "password";
        togglePassword.classList.remove("fa-eye-slash");
        togglePassword.classList.add("fa-eye");
    }
});