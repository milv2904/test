let sucess = document.getElementById("success_alert");
let error = document.getElementById("fail_alert");
error.hidden=true

export default function showSuccessAlert(message){
    document.getElementById("success_text").innerText = message
    sucess.hidden = false;
    error.hidden = true;
    sucess.classList.add('show')
    setTimeout(function (){sucess.classList.remove('show')},5000)

}

export function showFailAlert(message){
    document.getElementById("fail_text").innerText = message
    error.hidden = true;
    error.hidden = false;
    error.classList.add('show')
    setTimeout(function () {error.classList.remove('show')},5000)
}